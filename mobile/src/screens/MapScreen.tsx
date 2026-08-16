import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
} from "react-native";

import * as Location from "expo-location";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../theme/colors";
import { useAuthStore } from "../store/useAuthStore";
import ProfileDetailScreen
  from "../features/profile/components/ProfileDetailScreen";
import type {
  ProfileUpdateResult,
} from "../features/profile/types/profile.types";
import OccurrenceDetailDrawer from "../features/occurrences/components/OccurrenceDetailDrawer";
import { occurrenceService } from "../features/occurrences/services/occurrenceService";
import type { OcorrenciaResumo } from "../features/occurrences/types/occurrence.types";
import AppNavigationDrawer from "../components/AppNavigationDrawer";
import ProfileQuickMenu from "../features/profile/components/ProfileQuickMenu";
import api from "../services/api";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { AppTabParamList } from "../navigation/navigation.types";

import Mapbox from "@rnmapbox/maps";

/**
 * ============================================================
 * MAPBOX
 * ============================================================
 */

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (!MAPBOX_ACCESS_TOKEN) {
  console.error("MAPBOX: EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN não foi encontrada.");
} else {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
}

/**
 * ============================================================
 * CONFIGURAÇÃO INICIAL DO MAPA
 *
 * IMPORTANTE:
 * Mapbox usa:
 *
 * [longitude, latitude]
 * ============================================================
 */

const INITIAL_COORDINATE: [number, number] = [-43.9345, -19.9167];

const INITIAL_ZOOM = 14;

const MIN_SEARCH_RADIUS_KM = 1;
const MAX_SEARCH_RADIUS_KM = 100;
const DEFAULT_SEARCH_RADIUS_KM = 10;

const normalizarRaioPesquisaKm = (valor: unknown): number => {
  if (valor === null || valor === undefined || valor === "") {
    return DEFAULT_SEARCH_RADIUS_KM;
  }

  const raioRecebido = Number(valor);

  return Number.isFinite(raioRecebido)
    ? Math.min(
        MAX_SEARCH_RADIUS_KM,
        Math.max(MIN_SEARCH_RADIUS_KM, raioRecebido),
      )
    : DEFAULT_SEARCH_RADIUS_KM;
};

/**
 * ============================================================
 * TIPO DAS OCORRÊNCIAS
 *
 * Compatível com o retorno real do backend:
 *
 * /ocorrencias/proximas
 * ============================================================
 */

interface OcorrenciaMapa extends OcorrenciaResumo {
  id_conta: number;
  latitude: number;
  longitude: number;
}

type RecarregarListaOcorrencias = () => void | Promise<void>;

/**
 * ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================
 */

export default function MapScreen() {
  /**
   * ==========================================================
   * NAVEGAÇÃO
   * ==========================================================
   */

  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();

  /**
   * ==========================================================
   * AUTENTICAÇÃO
   * ==========================================================
   */

  const user = useAuthStore((state) => state.user);

  /**
   * ==========================================================
   * REFS DO MAPBOX
   * ==========================================================
   */

  const mapRef = useRef<Mapbox.MapView | null>(null);

  const cameraRef = useRef<Mapbox.Camera | null>(null);

  const raioPesquisaKmRef = useRef(DEFAULT_SEARCH_RADIUS_KM);

  /**
   * ==========================================================
   * ANIMAÇÕES
   * ==========================================================
   */

  const searchFocusAnim = useRef(new Animated.Value(0)).current;

  const discoveryAnim = useRef(new Animated.Value(1)).current;

  /**
   * ==========================================================
   * ESTADOS
   * ==========================================================
   */

  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);

  const [loadingLocation, setLoadingLocation] = useState(true);

  const [mapReady, setMapReady] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);

  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  const [profileDetailVisible, setProfileDetailVisible] = useState(false);

  const [filtersVisible, setFiltersVisible] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const [raioPesquisaKm, setRaioPesquisaKm] = useState<number>(
    DEFAULT_SEARCH_RADIUS_KM,
  );

  const [perfilMapaCarregado, setPerfilMapaCarregado] = useState(false);

  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todas");
  const [urgenciaFiltro, setUrgenciaFiltro] = useState("Todas");

  const [discoveryVisible, setDiscoveryVisible] = useState(true);

  const [ocorrencias, setOcorrencias] = useState<OcorrenciaMapa[]>([]);

  const [loadingOcorrencias, setLoadingOcorrencias] = useState(false);

  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<
    number | null
  >(null);

  const recarregarListaOrigemRef = useRef<RecarregarListaOcorrencias | null>(
    null,
  );

  const abrirDetalheOcorrencia = useCallback(
    (occurrenceId: number, recarregarLista?: RecarregarListaOcorrencias) => {
      recarregarListaOrigemRef.current = recarregarLista ?? null;
      setSelectedOccurrenceId(occurrenceId);
    },
    [],
  );

  useEffect(() => {
    raioPesquisaKmRef.current = raioPesquisaKm;
  }, [raioPesquisaKm]);

  const ocorrenciasVisiveis = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase();
    return ocorrencias.filter((ocorrencia) => {
      const correspondeBusca =
        !termo ||
        [
          ocorrencia.tipo_animal,
          ocorrencia.tipo_ocorrencia,
          ocorrencia.status_badge,
          ocorrencia.endereco_localizacao || "",
        ].some((valor) => valor.toLocaleLowerCase().includes(termo));
      const correspondeTipo =
        tipoFiltro === "Todas" ||
        (tipoFiltro === "Perdidos" &&
          ocorrencia.status_badge.toLocaleLowerCase().includes("perdid")) ||
        (tipoFiltro === "Avistados" &&
          ocorrencia.status_badge.toLocaleLowerCase().includes("avist"));
      const correspondeUrgencia =
        urgenciaFiltro === "Todas" ||
        ocorrencia.nivel_urgencia
          .toLocaleLowerCase()
          .startsWith(
            urgenciaFiltro.toLocaleLowerCase().replace("moderada", "moderad"),
          );
      return correspondeBusca && correspondeTipo && correspondeUrgencia;
    });
  }, [ocorrencias, search, tipoFiltro, urgenciaFiltro]);

  /**
   * ==========================================================
   * INICIALIZAÇÃO
   * ==========================================================
   */

  useEffect(() => {
    void carregarPerfilMapa().finally(() => {
      setPerfilMapaCarregado(true);
    });

    const timer = setTimeout(() => {
      Animated.timing(discoveryAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setDiscoveryVisible(false);
      });
    }, 4500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  /**
   * ==========================================================
   * CENTRALIZAÇÃO APÓS MAPBOX ESTAR PRONTO
   *
   * Isso evita o problema de tentar mexer na câmera antes
   * de o Mapbox terminar de inicializar.
   * ==========================================================
   */

  useEffect(() => {
    if (!mapReady || !userLocation) {
      return;
    }

    const coordinate: [number, number] = [
      userLocation.coords.longitude,
      userLocation.coords.latitude,
    ];

    cameraRef.current?.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: INITIAL_ZOOM,
      animationDuration: 1000,
      animationMode: "flyTo",
    });
  }, [mapReady, userLocation]);

  /**
   * ==========================================================
   * PERFIL
   * ==========================================================
   */

  const carregarPerfilMapa = async () => {
    try {
      const response = await api.get("/auth/me");

      setProfilePhoto(response.data?.foto_perfil ?? null);
      setRaioPesquisaKm(
        normalizarRaioPesquisaKm(response.data?.raio_pesquisa_km),
      );
    } catch (error) {
      console.warn("Erro ao carregar perfil do mapa:", error);
    }
  };

  /**
   * ==========================================================
   * LOCALIZAÇÃO
   * ==========================================================
   */

  const obterLocalizacaoInicial = useCallback(async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Localização desativada",
          "Precisamos da sua localização para centralizar o mapa e encontrar ocorrências próximas.",
        );

        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation(currentLocation);
    } catch (error) {
      console.warn("Erro ao obter localização:", error);
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  /**
   * ==========================================================
   * RECENTRALIZAR MAPA
   * ==========================================================
   */

  const recentralizarMapa = async () => {
    if (!userLocation) {
      await obterLocalizacaoInicial();
      return;
    }

    if (!mapReady) {
      return;
    }

    const coordinate: [number, number] = [
      userLocation.coords.longitude,
      userLocation.coords.latitude,
    ];

    cameraRef.current?.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: INITIAL_ZOOM,
      animationDuration: 800,
      animationMode: "flyTo",
    });
  };

  /**
   * ==========================================================
   * OCORRÊNCIAS PRÓXIMAS
   *
   * Endpoint real do backend:
   *
   * GET /ocorrencias/proximas
   *
   * Parâmetros:
   * lat
   * lng
   * raio_km
   * ==========================================================
   */

  const carregarOcorrenciasProximas = useCallback(
    async (latitude: number, longitude: number, raioKm: number) => {
      try {
        setLoadingOcorrencias(true);

        const response = await occurrenceService.getNearby<OcorrenciaMapa>({
          lat: latitude,
          lng: longitude,
          raio_km: raioKm,
        });

        const dados = Array.isArray(response.data) ? response.data : [];

        const ocorrenciasValidas = dados.filter(
          (ocorrencia: OcorrenciaMapa) =>
            Number.isFinite(Number(ocorrencia.latitude)) &&
            Number.isFinite(Number(ocorrencia.longitude)),
        );

        setOcorrencias(ocorrenciasValidas);
      } catch (error) {
        console.warn("Erro ao carregar ocorrências próximas:", error);

        setOcorrencias([]);
      } finally {
        setLoadingOcorrencias(false);
      }
    },
    [],
  );

  const recarregarOcorrenciasNoMapa = useCallback(async () => {
    if (userLocation) {
      await carregarOcorrenciasProximas(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        raioPesquisaKmRef.current,
      );
      return;
    }

    await obterLocalizacaoInicial();
  }, [carregarOcorrenciasProximas, obterLocalizacaoInicial, userLocation]);

  const handleOccurrenceDeleted = useCallback(
    async (occurrenceId: number) => {
      setOcorrencias((atuais) =>
        atuais.filter(
          (ocorrencia) => ocorrencia.id_ocorrencia !== occurrenceId,
        ),
      );

      const recarregarListaOrigem = recarregarListaOrigemRef.current;
      recarregarListaOrigemRef.current = null;

      const atualizacoes: Promise<unknown>[] = [recarregarOcorrenciasNoMapa()];
      if (recarregarListaOrigem) {
        atualizacoes.push(Promise.resolve().then(recarregarListaOrigem));
      }

      await Promise.allSettled(atualizacoes);
    },
    [recarregarOcorrenciasNoMapa],
  );

  const handleOccurrenceEdit = useCallback(
    (occurrenceId: number) => {
      navigation.navigate("CadastroOcorrencia", { ocorrenciaId: occurrenceId });
    },
    [navigation],
  );

  /**
   * ==========================================================
   * ATUALIZAÇÃO AO VOLTAR PARA O MAPA
   * ==========================================================
   */

  useFocusEffect(
    useCallback(() => {
      if (!perfilMapaCarregado) {
        return;
      }

      const atualizarMapa = async () => {
        await recarregarOcorrenciasNoMapa();

        const recarregarListaOrigem = recarregarListaOrigemRef.current;
        if (recarregarListaOrigem) {
          recarregarListaOrigemRef.current = null;
          await recarregarListaOrigem();
        }
      };

      void atualizarMapa();
    }, [perfilMapaCarregado, recarregarOcorrenciasNoMapa]),
  );

  const handleProfileUpdated = useCallback(
    (updatedProfile: ProfileUpdateResult) => {
      const novoRaio = normalizarRaioPesquisaKm(
        updatedProfile.raio_pesquisa_km,
      );

      setRaioPesquisaKm(novoRaio);
      setProfilePhoto(updatedProfile.foto_perfil ?? null);

      if (userLocation) {
        void carregarOcorrenciasProximas(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          novoRaio,
        );
      }
    },
    [carregarOcorrenciasProximas, userLocation],
  );
  /**
   * ==========================================================
   * ZOOM
   * ==========================================================
   */

  const alterarZoom = async (zoomIn: boolean) => {
    try {
      const zoomAtual = await mapRef.current?.getZoom();

      if (zoomAtual === undefined || zoomAtual === null) {
        return;
      }

      const novoZoom = Math.max(3, Math.min(20, zoomAtual + (zoomIn ? 1 : -1)));

      cameraRef.current?.zoomTo(novoZoom, 250);
    } catch (error) {
      console.warn("Erro ao alterar zoom:", error);
    }
  };

  /**
   * ==========================================================
   * DRAWER
   * ==========================================================
   */

  const abrirMenu = () => {
    setMenuVisible(true);
  };

  const fecharMenu = () => {
    setMenuVisible(false);
  };

  /**
   * ==========================================================
   * BUSCA
   * ==========================================================
   */

  const handleSearchFocus = () => {
    Animated.timing(searchFocusAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const handleSearchBlur = () => {
    Animated.timing(searchFocusAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* ======================================================
          MAPBOX
      ======================================================= */}

      <Mapbox.MapView
        ref={mapRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
        styleURL={Mapbox.StyleURL.Street}
        compassEnabled={false}
        logoEnabled={true}
        attributionEnabled={true}
        scaleBarEnabled={false}
        rotateEnabled={true}
        pitchEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        onMapIdle={() => {
          setMapReady(true);
        }}
      >
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: INITIAL_COORDINATE,
            zoomLevel: INITIAL_ZOOM,
            pitch: 0,
            heading: 0,
          }}
        />

        <Mapbox.UserLocation visible={true} showsUserHeadingIndicator={false} />

        {/* ==================================================
            MARCADORES DAS OCORRÊNCIAS
        =================================================== */}

        {ocorrenciasVisiveis.map((ocorrencia) => {
          const latitude = Number(ocorrencia.latitude);
          const longitude = Number(ocorrencia.longitude);

          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return null;
          }

          const animalEhGato = ocorrencia.tipo_animal
            ?.toLowerCase()
            .includes("gato");

          return (
            <Mapbox.MarkerView
              key={ocorrencia.id_ocorrencia}
              coordinate={[longitude, latitude]}
              anchor={{
                x: 0.5,
                y: 1,
              }}
              allowOverlap={true}
              allowOverlapWithPuck={true}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Ocorrência de ${
                  ocorrencia.tipo_animal || "animal"
                }`}
                accessibilityHint="Mostra os detalhes desta ocorrência"
                onPress={() => {
                  abrirDetalheOcorrencia(ocorrencia.id_ocorrencia);
                }}
                style={({ pressed }) => [
                  styles.markerPressable,
                  pressed && styles.markerPressed,
                ]}
              >
                <View collapsable={false} style={styles.occurrenceMarker}>
                  <View style={styles.markerPin}>
                    <View style={styles.markerPhotoWrapper}>
                      {ocorrencia.foto ? (
                        <Image
                          source={{
                            uri: ocorrencia.foto,
                          }}
                          style={styles.markerPhoto}
                        />
                      ) : (
                        <View style={styles.markerPhotoPlaceholder}>
                          <MaterialCommunityIcons
                            name={animalEhGato ? "cat" : "dog"}
                            size={24}
                            color={theme.colors.textBody}
                          />
                        </View>
                      )}

                      <View style={styles.markerAnimalBadge}>
                        <MaterialCommunityIcons
                          name={animalEhGato ? "cat" : "dog"}
                          size={11}
                          color={theme.colors.surface}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.markerPointer} />
                </View>
              </Pressable>
            </Mapbox.MarkerView>
          );
        })}
      </Mapbox.MapView>

      {/* ======================================================
          LOADING — LOCALIZAÇÃO
      ======================================================= */}

      {loadingLocation && (
        <View style={styles.locationLoading} pointerEvents="none">
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.brand} />

            <Text style={styles.loadingText}>Localizando você...</Text>
          </View>
        </View>
      )}

      {/* ======================================================
          LOADING — OCORRÊNCIAS
      ======================================================= */}

      {loadingOcorrencias && !loadingLocation && (
        <View style={styles.ocorrenciasLoading} pointerEvents="none">
          <View style={styles.ocorrenciasLoadingBadge}>
            <ActivityIndicator size="small" color={theme.colors.brand} />

            <Text style={styles.ocorrenciasLoadingText}>
              Encontrando ocorrências...
            </Text>
          </View>
        </View>
      )}

      {/* ======================================================
          HEADER
      ======================================================= */}

      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir menu"
          onPress={abrirMenu}
          style={({ pressed }) => [
            styles.headerIconButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="menu-outline"
            size={24}
            color={theme.colors.textTitle}
          />
        </Pressable>

        <Animated.View
          style={[
            styles.searchBox,
            {
              borderColor: searchFocusAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["transparent", theme.colors.brand],
              }),
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={19}
            color={theme.colors.textBody}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar no mapa"
            placeholderTextColor={theme.colors.textBody}
            style={styles.searchInput}
            returnKeyType="search"
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            accessibilityLabel="Buscar no mapa"
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} hitSlop={8}>
              <Ionicons
                name="close-circle"
                size={18}
                color={theme.colors.textBody}
              />
            </Pressable>
          )}
        </Animated.View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir filtros"
          onPress={() => setFiltersVisible(true)}
          style={({ pressed }) => [
            styles.headerFilterButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={theme.colors.textTitle}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil"
          onPress={() => setProfileMenuVisible(true)}
          style={({ pressed }) => [
            styles.avatarButton,
            pressed && styles.pressed,
          ]}
        >
          <Image
            source={{
              uri: profilePhoto || "https://i.pravatar.cc/150?img=11",
            }}
            style={styles.avatarImage}
          />

          <View style={styles.onlineIndicator} />
        </Pressable>
      </View>

      {/* ======================================================
          STATUS / TOGGLE
      ======================================================= */}

      <View style={styles.statusCardContainer} pointerEvents="none">
        {discoveryVisible && (
          <Animated.View
            style={[
              styles.statusCard,
              {
                opacity: discoveryAnim,
                transform: [
                  {
                    translateY: discoveryAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-8, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.statusIcon}>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                size={20}
                color={theme.colors.brand}
              />
            </View>

            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Área de busca</Text>

              <Text style={styles.statusDescription}>
                Explorando ocorrências próximas
              </Text>
            </View>
          </Animated.View>
        )}

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />

          <Text style={styles.liveText}>ATIVO</Text>
        </View>
      </View>

      {/* ======================================================
          CONTROLES DO MAPA
      ======================================================= */}

      <View style={styles.mapZoomControls}>
        <View style={styles.controlGroup}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Aumentar zoom"
            onPress={() => alterarZoom(true)}
            style={({ pressed }) => [
              styles.mapControlButton,
              pressed && styles.controlPressed,
            ]}
          >
            <Ionicons name="add" size={22} color={theme.colors.textTitle} />
          </Pressable>

          <View style={styles.controlDivider} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Diminuir zoom"
            onPress={() => alterarZoom(false)}
            style={({ pressed }) => [
              styles.mapControlButton,
              pressed && styles.controlPressed,
            ]}
          >
            <Ionicons name="remove" size={22} color={theme.colors.textTitle} />
          </Pressable>
        </View>
      </View>

      {/* ======================================================
          RECENTRALIZAR
      ======================================================= */}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Centralizar minha localização"
        onPress={recentralizarMapa}
        style={({ pressed }) => [
          styles.locationButton,
          pressed && styles.locationButtonPressed,
        ]}
      >
        <View style={styles.locationButtonInner}>
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={23}
            color={theme.colors.brand}
          />
        </View>
      </Pressable>

      {/* ======================================================
          ÁREA INFERIOR
      ======================================================= */}

      <View style={styles.bottomArea}>
        {/*  — Banner provisório de anúncio */}
        <View style={styles.adBanner}>
          <View style={styles.adBadge}>
            <Text style={styles.adBadgeText}>ANÚNCIO</Text>
          </View>

          <View style={styles.adContent}>
            <Text style={styles.adTitle}>Espaço publicitário</Text>

            <Text style={styles.adDescription}>
              Banner provisório para futura integração de anúncios
            </Text>
          </View>

          <View style={styles.adIcon}>
            <Ionicons
              name="megaphone-outline"
              size={20}
              color={theme.colors.brand}
            />
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Registrar ocorrência"
          onPress={() => navigation.navigate("CadastroOcorrencia")}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <View style={styles.primaryButtonIcon}>
            <MaterialCommunityIcons
              name="plus"
              size={21}
              color={theme.colors.brand}
            />
          </View>

          <View style={styles.primaryButtonContent}>
            <Text style={styles.primaryButtonLabel}>REGISTRAR OCORRÊNCIA</Text>

            <Text style={styles.primaryButtonHint}>Avise a comunidade</Text>
          </View>

          <View style={styles.primaryButtonArrow}>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={theme.colors.surface}
            />
          </View>
        </Pressable>
      </View>
      {/* ======================================================
    MENU RÁPIDO DO PERFIL

======================================================= */}

      <ProfileQuickMenu
        visible={profileMenuVisible}
        profilePhoto={profilePhoto}
        userName={user?.name || null}
        userEmail={user?.email || null}
        onClose={() => {
          setProfileMenuVisible(false);
        }}
        onOpenProfile={() => {
          setProfileDetailVisible(true);
        }}
      />

      {/* ======================================================
          FILTROS
      ======================================================= */}

      <Modal
        visible={filtersVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFiltersVisible(false)}
      >
        <View style={styles.filterModalContainer}>
          <Pressable
            style={styles.filterBackdrop}
            onPress={() => setFiltersVisible(false)}
          />

          <View style={styles.filterSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Filtrar ocorrências</Text>

                <Text style={styles.sheetSubtitle}>
                  Personalize o que aparece no mapa
                </Text>
              </View>

              <Pressable
                onPress={() => setFiltersVisible(false)}
                style={styles.sheetClose}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={theme.colors.textTitle}
                />
              </Pressable>
            </View>

            <Text style={styles.filterSectionTitle}>Tipo de ocorrência</Text>

            <View style={styles.chipGrid}>
              {["Todas", "Perdidos", "Avistados"].map((label) => (
                <Pressable
                  key={label}
                  style={[
                    styles.filterChip,
                    label === tipoFiltro && styles.filterChipSelected,
                  ]}
                  onPress={() => setTipoFiltro(label)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      label === tipoFiltro && styles.filterChipTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text
              style={[styles.filterSectionTitle, styles.secondFilterSection]}
            >
              Nível de urgência
            </Text>

            <View style={styles.chipGrid}>
              {["Todas", "Alta", "Moderada", "Baixa"].map((label) => (
                <Pressable
                  key={label}
                  style={[
                    styles.filterChip,
                    label === urgenciaFiltro && styles.filterChipSelected,
                  ]}
                  onPress={() => setUrgenciaFiltro(label)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      label === urgenciaFiltro && styles.filterChipTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.filterActions}>
              <Pressable
                onPress={() => {
                  setTipoFiltro("Todas");
                  setUrgenciaFiltro("Todas");
                }}
                style={styles.clearFiltersButton}
              >
                <Text style={styles.clearFiltersText}>Limpar</Text>
              </Pressable>

              <Pressable
                onPress={() => setFiltersVisible(false)}
                style={styles.applyFiltersButton}
              >
                <Text style={styles.applyFiltersText}>Aplicar filtros</Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={theme.colors.surface}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================
    DRAWER LATERAL

  

    Componente compartilhado entre Mapa e Feed.
======================================================= */}

      <AppNavigationDrawer
        visible={menuVisible}
        activeScreen="Mapa"
        profilePhoto={profilePhoto}
        userName={user?.name || null}
        userEmail={user?.email || null}
        onClose={fecharMenu}
        onNavigateMap={() => {
          navigation.navigate("Mapa");
        }}
        onNavigateFeed={() => {
          navigation.navigate("Feed");
        }}
      />

      {/* ======================================================
          PERFIL COMPLETO
      ======================================================= */}

      <ProfileDetailScreen
        visible={profileDetailVisible}
        onClose={() => setProfileDetailVisible(false)}
        onProfileUpdated={handleProfileUpdated}
        onOccurrencePress={abrirDetalheOcorrencia}
      />

      {/* ======================================================
          DETALHES DA OCORRÊNCIA
      ======================================================= */}

      <OccurrenceDetailDrawer
        visible={selectedOccurrenceId !== null}
        occurrenceId={selectedOccurrenceId}
        onClose={() => setSelectedOccurrenceId(null)}
        onEdit={handleOccurrenceEdit}
        onDeleted={handleOccurrenceDeleted}
      />
    </SafeAreaView>
  );
}

/**
 * ============================================================
 * STYLES
 * ============================================================
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  pressed: {
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  controlPressed: {
    backgroundColor: theme.colors.inputBg,
  },

  /**
   * ========================================================
   * LOADING LOCALIZAÇÃO
   * ========================================================
   */

  locationLoading: {
    position: "absolute",
    top: Platform.OS === "ios" ? 112 : 104,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },

  loadingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.button,
    backgroundColor: "rgba(255,255,255,0.96)",
    ...theme.shadows.elevation1,
  },

  loadingText: {
    color: theme.colors.textTitle,
    fontSize: 12,
    fontWeight: "600",
  },

  headerFilterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.shadows.elevation1,
  },

  /**
   * ========================================================
   * LOADING OCORRÊNCIAS
   * ========================================================
   */

  ocorrenciasLoading: {
    position: "absolute",
    top: Platform.OS === "ios" ? 166 : 170,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 19,
  },

  ocorrenciasLoadingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.94)",
    ...theme.shadows.elevation1,
  },

  ocorrenciasLoadingText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textTitle,
  },

  /**
   * ========================================================
   * HEADER
   * ========================================================
   */

  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 34 : 38,
    left: theme.spacing.padding,
    right: theme.spacing.padding,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 10,
  },

  headerIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.shadows.elevation1,
  },

  searchBox: {
    flex: 1,
    height: 50,
    borderRadius: theme.radius.button,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 9,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderWidth: 1.5,
    ...theme.shadows.elevation1,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 0,
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "500",
  },

  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.shadows.elevation1,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },

  onlineIndicator: {
    position: "absolute",
    right: 1,
    bottom: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.semantic.success.text,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },

  /**
   * ========================================================
   * STATUS
   * ========================================================
   */

  statusCardContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 104 : 108,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 5,
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.94)",
    ...theme.shadows.elevation1,
  },

  statusIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
    marginRight: 9,
  },

  statusContent: {
    flexShrink: 1,
  },

  statusTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textBody,
    marginBottom: 1,
  },

  statusDescription: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textTitle,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
    backgroundColor: theme.colors.semantic.success.text,
  },

  liveText: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: theme.colors.semantic.success.text,
  },

  /**
   * ========================================================
   * CONTROLES
   * ========================================================
   */

  mapZoomControls: {
    position: "absolute",
    right: 20,
    bottom: Platform.OS === "ios" ? 330 : 318,
    alignItems: "center",
    zIndex: 8,
  },

  controlGroup: {
    width: 46,
    overflow: "hidden",
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.shadows.elevation1,
  },

  mapControlButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  controlDivider: {
    height: 1,
    marginHorizontal: 10,
    backgroundColor: theme.colors.inputBg,
  },

  filterButton: {
    minWidth: 106,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: theme.radius.button,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.shadows.elevation1,
  },

  filterButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textTitle,
  },

  /**
   * ========================================================
   * LOCALIZAÇÃO
   * ========================================================
   */

  locationButton: {
    position: "absolute",
    right: 16,
    bottom: Platform.OS === "ios" ? 260 : 250,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.98)",
    zIndex: 8,
    ...theme.shadows.elevation1,
  },

  locationButtonPressed: {
    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  locationButtonInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
  },

  /**
   * ========================================================
   * ÁREA INFERIOR
   * ========================================================
   */

  bottomArea: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 60 : 62,
    zIndex: 10,
    gap: 10,
  },

  discoveryCard: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.96)",
    ...theme.shadows.elevation1,
  },

  discoveryIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
    marginRight: 11,
  },

  discoveryContent: {
    flex: 1,
    paddingRight: 8,
  },

  discoveryTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textTitle,
    marginBottom: 3,
  },

  discoveryDescription: {
    fontSize: 10.5,
    lineHeight: 15,
    color: theme.colors.textBody,
  },

  primaryButton: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 19,
    backgroundColor: theme.colors.brand,
    ...theme.shadows.buttonGlow,
  },

  primaryButtonPressed: {
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  primaryButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    marginRight: 11,
  },

  primaryButtonContent: {
    flex: 1,
  },

  primaryButtonLabel: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  primaryButtonHint: {
    marginTop: 2,
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    fontWeight: "500",
  },

  primaryButtonArrow: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  // ========================================================
  // BANNER DE ANÚNCIO PROVISÓRIO
  // ========================================================

  adBanner: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderWidth: 1,
    borderColor: theme.colors.inputBg,
    ...theme.shadows.elevation1,
  },

  adBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: theme.colors.inputBg,
    marginRight: 10,
  },

  adBadgeText: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: theme.colors.textBody,
  },

  adContent: {
    flex: 1,
    paddingRight: 8,
  },

  adTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textTitle,
    marginBottom: 2,
  },

  adDescription: {
    fontSize: 9.5,
    lineHeight: 13,
    color: theme.colors.textBody,
  },

  adIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
  },
  /**
   * ========================================================
   * MARCADOR PREMIUM
   * ========================================================
   */

  markerPressable: {
    alignItems: "center",
    justifyContent: "center",
  },

  markerPressed: {
    transform: [
      {
        scale: 0.92,
      },
    ],
  },

  occurrenceMarker: {
    width: 68,
    height: 82,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "visible",
  },

  markerPin: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 3,
    borderColor: theme.colors.brand,
    ...theme.shadows.elevation1,
  },

  markerPhotoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },

  markerPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.inputBg,
  },

  markerPhotoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.inputBg,
  },

  markerAnimalBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 19,
    height: 19,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.brand,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },

  markerPointer: {
    width: 0,
    height: 0,
    marginTop: -1,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: theme.colors.brand,
  },

  /**
   * ========================================================
   * FILTROS
   * ========================================================
   */

  filterModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  filterBackdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  filterSheet: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 32 : 22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.elevation1,
  },

  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
    backgroundColor: theme.colors.inputBg,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  sheetSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textBody,
  },

  sheetClose: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.inputBg,
  },

  filterSectionTitle: {
    marginBottom: 11,
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  secondFilterSection: {
    marginTop: 23,
  },

  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  filterChip: {
    minHeight: 38,
    paddingHorizontal: 15,
    borderRadius: theme.radius.button,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: "transparent",
  },

  filterChipSelected: {
    backgroundColor: theme.colors.semantic.success.bg,
    borderColor: theme.colors.brand,
  },

  filterChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textBody,
  },

  filterChipTextSelected: {
    color: theme.colors.brand,
    fontWeight: "800",
  },

  filterActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 28,
  },

  clearFiltersButton: {
    flex: 0.35,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.inputBg,
  },

  clearFiltersText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textTitle,
  },

  applyFiltersButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.brand,
    ...theme.shadows.buttonGlow,
  },

  applyFiltersText: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.surface,
  },

  /**
   * ========================================================
   * SOS
   * ========================================================
   */

  sosCard: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.semantic.danger.bg,
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  sosIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },

  sosContent: {
    flex: 1,
    marginLeft: 10,
  },

  sosTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.semantic.danger.text,
  },

  sosDescription: {
    marginTop: 2,
    fontSize: 9,
    color: theme.colors.textBody,
  },
});
