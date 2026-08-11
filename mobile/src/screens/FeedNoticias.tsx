// ============================================================
// D:\PetRadar\src\mobile\src\screens\FeedNoticias.tsx
// ============================================================

import React, { useCallback, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import * as Location from "expo-location";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import type { AppTabParamList } from "../../App";

import api from "../services/api";

import OccurrenceDetailDrawer from "../components/OccurrenceDetailDrawer";

import AppNavigationDrawer from "../components/AppNavigationDrawer";

import ProfileQuickMenu from "../components/ProfileQuickMenu";

import ProfileDetailScreen, {
    type ProfileUpdateResult,
} from "./ProfileDetailScreen";

import { theme } from "../theme/colors";

import { useAuthStore } from "../store/useAuthStore";

// ============================================================
// CONSTANTES
// ============================================================

const DEFAULT_SEARCH_RADIUS_KM = 10;
const MIN_SEARCH_RADIUS_KM = 1;
const MAX_SEARCH_RADIUS_KM = 100;

// ============================================================
// TIPAGEM
// ============================================================

interface OcorrenciaFeed {
  id_ocorrencia: number;
  id_conta: number;

  tipo_ocorrencia: string;
  status_badge: string;
  tipo_animal: string;

  foto: string;

  nivel_urgencia: string;
  data_ocorrencia: string;

  endereco_localizacao?: string | null;

  latitude: number;
  longitude: number;

  distancia_km?: number | null;

}
type RecarregarListaOcorrencias =
    () => void | Promise<void>;

type FiltroFeed = "TODAS" | "PERDIDOS" | "AVISTADOS" | "RUA" | "URGENTES";

interface FiltroConfig {
  id: FiltroFeed;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface StatusVisual {
  label: string;
  textColor: string;
  backgroundColor: string;
}

interface OccurrenceCardProps {
  occurrence: OcorrenciaFeed;
  onPress: (occurrenceId: number) => void;
}

// ============================================================
// FILTROS
// ============================================================

const FILTROS: FiltroConfig[] = [
  {
    id: "TODAS",
    label: "Todas",
    icon: "apps-outline",
  },
  {
    id: "PERDIDOS",
    label: "Perdidos",
    icon: "paw-outline",
  },
  {
    id: "AVISTADOS",
    label: "Avistados",
    icon: "eye-outline",
  },
  {
    id: "RUA",
    label: "Animal de rua",
    icon: "home-outline",
  },
  {
    id: "URGENTES",
    label: "Urgentes",
    icon: "warning-outline",
  },
];

// ============================================================
// UTILITÁRIOS
// ============================================================

function normalizarTexto(valor: string | null | undefined) {
  return (valor ?? "")
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function capitalizar(valor: string) {
  const texto = valor.trim().toLocaleLowerCase().replace(/_/g, " ");

  if (!texto) {
    return "Animal";
  }

  return texto.charAt(0).toLocaleUpperCase() + texto.slice(1);
}

function formatarDistancia(distanciaKm: number | null | undefined) {
  const distancia = Number(distanciaKm);

  if (!Number.isFinite(distancia) || distancia < 0) {
    return "Distância indisponível";
  }

  if (distancia < 1) {
    return `${Math.round(distancia * 1000)} m`;
  }

  return `${distancia.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
}

function formatarTempoRelativo(data: string) {
  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return "Data não informada";
  }

  const diferencaMs = Date.now() - date.getTime();

  if (diferencaMs <= 0) {
    return "Agora";
  }

  const minutos = Math.floor(diferencaMs / (1000 * 60));

  if (minutos < 1) {
    return "Agora";
  }

  if (minutos < 60) {
    return `há ${minutos} min`;
  }

  const horas = Math.floor(minutos / 60);

  if (horas < 24) {
    return horas === 1 ? "há 1 hora" : `há ${horas} horas`;
  }

  const dias = Math.floor(horas / 24);

  if (dias < 7) {
    return dias === 1 ? "há 1 dia" : `há ${dias} dias`;
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function obterStatusVisual(occurrence: OcorrenciaFeed): StatusVisual {
  const status = normalizarTexto(occurrence.status_badge);

  if (status.includes("perdid")) {
    return {
      label: "Perdido",
      textColor: theme.colors.semantic.danger.text,
      backgroundColor: theme.colors.semantic.danger.bg,
    };
  }

  if (status.includes("avist")) {
    return {
      label: "Avistado",
      textColor: theme.colors.semantic.warning.text,
      backgroundColor: theme.colors.semantic.warning.bg,
    };
  }

  return {
    label: "Animal de rua",
    textColor: theme.colors.semantic.success.text,
    backgroundColor: theme.colors.semantic.success.bg,
  };
}

function obterTituloOcorrencia(occurrence: OcorrenciaFeed) {
  const animal = capitalizar(occurrence.tipo_animal);

  const status = normalizarTexto(occurrence.status_badge);

  if (status.includes("perdid")) {
    return `${animal} perdido`;
  }

  if (status.includes("avist")) {
    return `${animal} avistado`;
  }

  return `${animal} precisa de ajuda`;
}

function ehUrgente(nivelUrgencia: string) {
  const urgencia = normalizarTexto(nivelUrgencia);

  return urgencia.includes("alta") || urgencia.includes("crit");
}

function obterUrgenciaVisual(nivelUrgencia: string) {
  const urgencia = normalizarTexto(nivelUrgencia);

  if (urgencia.includes("crit") || urgencia.includes("alta")) {
    return {
      color: theme.colors.semantic.danger.text,
      background: theme.colors.semantic.danger.bg,
    };
  }

  if (urgencia.includes("moder")) {
    return {
      color: theme.colors.semantic.warning.text,
      background: theme.colors.semantic.warning.bg,
    };
  }

  return {
    color: theme.colors.semantic.success.text,
    background: theme.colors.semantic.success.bg,
  };
}

// ============================================================
// CARD DA OCORRÊNCIA
// ============================================================

function OccurrenceCard({ occurrence, onPress }: OccurrenceCardProps) {
  const status = obterStatusVisual(occurrence);

  const urgencia = obterUrgenciaVisual(occurrence.nivel_urgencia);

  const fotoValida =
    typeof occurrence.foto === "string" && occurrence.foto.trim().length > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalhes de ${obterTituloOcorrencia(
        occurrence,
      )}`}
      accessibilityHint="Abre os detalhes completos da ocorrência"
      onPress={() => onPress(occurrence.id_ocorrencia)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* FOTO */}

      <View style={styles.imageContainer}>
        {fotoValida ? (
          <Image
            source={{
              uri: occurrence.foto,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imageFallback}>
            <MaterialCommunityIcons
              name="paw"
              size={42}
              color={theme.colors.brand}
            />

            <Text style={styles.imageFallbackText}>Foto indisponível</Text>
          </View>
        )}

        {/* STATUS */}

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: status.backgroundColor,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: status.textColor,
              },
            ]}
          />

          <Text
            style={[
              styles.statusText,
              {
                color: status.textColor,
              },
            ]}
          >
            {status.label}
          </Text>
        </View>

        {/* DISTÂNCIA */}

        <View style={styles.distanceBadge}>
          <Ionicons name="location" size={13} color={theme.colors.brand} />

          <Text style={styles.distanceText}>
            {formatarDistancia(occurrence.distancia_km)}
          </Text>
        </View>
      </View>

      {/* CONTEÚDO */}

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {obterTituloOcorrencia(occurrence)}
            </Text>

            <Text style={styles.timeText}>
              {formatarTempoRelativo(occurrence.data_ocorrencia)}
            </Text>
          </View>

          <View style={styles.animalIcon}>
            <MaterialCommunityIcons
              name={
                normalizarTexto(occurrence.tipo_animal).includes("gato")
                  ? "cat"
                  : "dog"
              }
              size={22}
              color={theme.colors.brand}
            />
          </View>
        </View>

        {/* LOCALIZAÇÃO */}

        <View style={styles.locationRow}>
          <View style={styles.locationIcon}>
            <Ionicons
              name="location-outline"
              size={17}
              color={theme.colors.brand}
            />
          </View>

          <Text style={styles.locationText} numberOfLines={2}>
            {occurrence.endereco_localizacao?.trim() ||
              "Localização informada no mapa"}
          </Text>
        </View>

        {/* DIVISOR */}

        <View style={styles.divider} />

        {/* FOOTER */}

        <View style={styles.cardFooter}>
          <View
            style={[
              styles.urgencyBadge,
              {
                backgroundColor: urgencia.background,
              },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={14}
              color={urgencia.color}
            />

            <Text
              style={[
                styles.urgencyText,
                {
                  color: urgencia.color,
                },
              ]}
            >
              {occurrence.nivel_urgencia || "Moderado"}
            </Text>
          </View>

          <Text style={styles.registryText}>
            Registro #{occurrence.id_ocorrencia}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// ============================================================
// TELA
// ============================================================

export default function FeedNoticias() {
  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();

  const user = useAuthStore((state) => state.user);

  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<
    number | null
  >(null);

  const [ocorrencias, setOcorrencias] = useState<OcorrenciaFeed[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [localizacaoNegada, setLocalizacaoNegada] = useState(false);

  const [raioPesquisaKm, setRaioPesquisaKm] = useState(
    DEFAULT_SEARCH_RADIUS_KM,
  );

  const [search, setSearch] = useState("");

  const [filtro, setFiltro] = useState<FiltroFeed>("TODAS");


// ==========================================================
// LISTA QUE ORIGINOU A ABERTURA DA OCORRÊNCIA
// ==========================================================

// [ALTERE AQUI]
const recarregarListaOrigemRef =
    useRef<
        RecarregarListaOcorrencias | null
    >(null);

  // ==========================================================
  // NAVEGAÇÃO / PERFIL
  // ==========================================================

  //
  const [menuVisible, setMenuVisible] = useState(false);

  //
  // Será utilizado no próximo passo para o menu rápido
  // do avatar.
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  //
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const [
    profileDetailVisible,
    setProfileDetailVisible,
] = useState(false);
  // ==========================================================
  // CARREGAR FEED
  // ==========================================================

  const carregarFeed = useCallback(
    async (modo: "normal" | "refresh" = "normal") => {
      if (modo === "refresh") {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        // ------------------------------------------------------
        // 1. RAIO DO PERFIL
        // ------------------------------------------------------

        let raioAtual = DEFAULT_SEARCH_RADIUS_KM;

        try {
          const profileResponse = await api.get("/auth/me");

          setProfilePhoto(profileResponse.data?.foto_perfil ?? null);

          const raioRecebido = Number(profileResponse.data?.raio_pesquisa_km);

          if (Number.isFinite(raioRecebido)) {
            raioAtual = Math.min(
              MAX_SEARCH_RADIUS_KM,
              Math.max(MIN_SEARCH_RADIUS_KM, raioRecebido),
            );
          }
        } catch (profileError) {
          console.warn(
            "[FeedNoticias] Não foi possível carregar o raio do perfil:",
            profileError,
          );
        }

        setRaioPesquisaKm(raioAtual);

        // ------------------------------------------------------
        // 2. PERMISSÃO DE LOCALIZAÇÃO
        // ------------------------------------------------------

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocalizacaoNegada(true);
          setOcorrencias([]);
          return;
        }

        setLocalizacaoNegada(false);

        // ------------------------------------------------------
        // 3. LOCALIZAÇÃO ATUAL
        // ------------------------------------------------------

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // ------------------------------------------------------
        // 4. OCORRÊNCIAS PRÓXIMAS
        // ------------------------------------------------------

        const response = await api.get<OcorrenciaFeed[]>(
          "/ocorrencias/proximas",
          {
            params: {
              lat: currentLocation.coords.latitude,

              lng: currentLocation.coords.longitude,

              raio_km: raioAtual,
            },
          },
        );

        const dados = Array.isArray(response.data) ? response.data : [];

        const ocorrenciasValidas = dados.filter(
          (occurrence) =>
            Number.isFinite(Number(occurrence.latitude)) &&
            Number.isFinite(Number(occurrence.longitude)),
        );

        // IMPORTANTE:
        // não ordenamos novamente aqui.
        //
        // O backend já deve devolver:
        //
        // mais perto -> mais distante
        //
        // conforme implementado no PASSO 1.

        setOcorrencias(ocorrenciasValidas);
      } catch (err: unknown) {
        console.warn("[FeedNoticias] Erro ao carregar feed:", err);

        setOcorrencias([]);

        setError("Não foi possível carregar as ocorrências próximas.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  // ==========================================================
  // ATUALIZAR AO ENTRAR NA TELA
  // ==========================================================

useFocusEffect(
    useCallback(() => {
        const atualizarFeed =
            async () => {
                // ==================================================
                // 1. RECARREGA O FEED
                // ==================================================

                await carregarFeed();

                // ==================================================
                // 2. VERIFICA SE A OCORRÊNCIA VEIO DO PERFIL
                // ==================================================

                const recarregarListaOrigem =
                    recarregarListaOrigemRef.current;

                if (
                    !recarregarListaOrigem
                ) {
                    return;
                }

                // Limpa antes de executar para evitar
                // chamadas duplicadas em futuros focuses.
                recarregarListaOrigemRef.current =
                    null;

                // ==================================================
                // 3. ATUALIZA A LISTA DO PERFIL
                // ==================================================

                await recarregarListaOrigem();
            };

        void atualizarFeed();
    }, [carregarFeed]),
);

  // ==========================================================
// PERFIL ATUALIZADO
// ==========================================================

// [ALTERE AQUI]
const handleProfileUpdated =
    useCallback(
        (
            updatedProfile: ProfileUpdateResult,
        ) => {
            // Atualização imediata do avatar,
            // caso a foto tenha sido alterada.
            if (
                updatedProfile.foto_perfil !==
                undefined
            ) {
                setProfilePhoto(
                    updatedProfile.foto_perfil ??
                        null,
                );
            }

            // Recarrega o estado oficial do perfil
            // e as ocorrências usando o novo raio.
            void carregarFeed();
        },
        [carregarFeed],
    );

  // ==========================================================
  // DETALHES DA OCORRÊNCIA
  // ==========================================================

const abrirDetalheOcorrencia =
    useCallback(
        (
            occurrenceId: number,
            recarregarLista?:
                RecarregarListaOcorrencias,
        ) => {
            recarregarListaOrigemRef.current =
                recarregarLista ?? null;

            setSelectedOccurrenceId(
                occurrenceId,
            );
        },
        [],
    );

  const handleOccurrenceEdit = useCallback(
    (occurrenceId: number) => {
      navigation.navigate("CadastroOcorrencia", {
        ocorrenciaId: occurrenceId,
      });
    },
    [navigation],
  );

const handleOccurrenceDeleted =
    useCallback(
        async (
            occurrenceId: number,
        ) => {
            // ==================================================
            // 1. REMOVE IMEDIATAMENTE DO FEED
            // ==================================================

            setOcorrencias((atuais) =>
                atuais.filter(
                    (occurrence) =>
                        occurrence.id_ocorrencia !==
                        occurrenceId,
                ),
            );

            // ==================================================
            // 2. RECUPERA A LISTA QUE ABRIU O DETALHE
            // ==================================================

            const recarregarListaOrigem =
                recarregarListaOrigemRef.current;

            recarregarListaOrigemRef.current =
                null;

            // ==================================================
            // 3. ATUALIZA AS LISTAS
            // ==================================================

            const atualizacoes:
                Promise<unknown>[] = [
                    carregarFeed("refresh"),
                ];

            // Se a ocorrência foi aberta pelo Perfil,
            // atualiza também as ocorrências do Perfil.
            if (
                recarregarListaOrigem
            ) {
                atualizacoes.push(
                    Promise.resolve().then(
                        recarregarListaOrigem,
                    ),
                );
            }

            await Promise.allSettled(
                atualizacoes,
            );
        },
        [carregarFeed],
    );

  // ==========================================================
  // NAVEGAÇÃO DO FEED
  // ==========================================================

  //
  const abrirMenu = useCallback(() => {
    setMenuVisible(true);
  }, []);

  //
  const fecharMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const registrarOcorrencia = useCallback(() => {
    navigation.navigate("CadastroOcorrencia");
  }, [navigation]);
  // ==========================================================
  // BUSCA + FILTROS
  // ==========================================================

  const ocorrenciasFiltradas = useMemo(() => {
    const termo = normalizarTexto(search);

    return ocorrencias.filter((occurrence) => {
      const correspondeBusca =
        !termo ||
        [
          occurrence.tipo_animal,
          occurrence.tipo_ocorrencia,
          occurrence.status_badge,
          occurrence.nivel_urgencia,
          occurrence.endereco_localizacao,
        ].some((valor) => normalizarTexto(valor).includes(termo));

      if (!correspondeBusca) {
        return false;
      }

      const status = normalizarTexto(occurrence.status_badge);

      switch (filtro) {
        case "PERDIDOS":
          return status.includes("perdid");

        case "AVISTADOS":
          return status.includes("avist");

        case "RUA":
          return (
            status.includes("rua") ||
            normalizarTexto(occurrence.tipo_ocorrencia).includes(
              "animal_de_rua",
            )
          );

        case "URGENTES":
          return ehUrgente(occurrence.nivel_urgencia);

        case "TODAS":
        default:
          return true;
      }
    });
  }, [ocorrencias, search, filtro]);

  // ==========================================================
  // LOADING INICIAL
  // ==========================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.stateContainer}>
          <View style={styles.stateIcon}>
            <MaterialCommunityIcons
              name="paw"
              size={35}
              color={theme.colors.brand}
            />
          </View>

          <ActivityIndicator size="small" color={theme.colors.brand} />

          <Text style={styles.stateTitle}>Buscando ocorrências</Text>

          <Text style={styles.stateDescription}>
            Estamos procurando animais próximos da sua localização.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // LOCALIZAÇÃO NEGADA
  // ==========================================================

  if (localizacaoNegada) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.stateContainer}>
          <View style={styles.stateIcon}>
            <Ionicons
              name="location-outline"
              size={34}
              color={theme.colors.brand}
            />
          </View>

          <Text style={styles.stateTitle}>Localização necessária</Text>

          <Text style={styles.stateDescription}>
            Precisamos da sua localização para mostrar as ocorrências mais
            próximas de você.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tentar permitir localização novamente"
            onPress={() => void carregarFeed()}
            style={({ pressed }) => [
              styles.stateButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Ionicons name="location" size={18} color={theme.colors.surface} />

            <Text style={styles.stateButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // ERRO
  // ==========================================================

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.stateContainer}>
          <View style={[styles.stateIcon, styles.errorIcon]}>
            <Ionicons
              name="cloud-offline-outline"
              size={34}
              color={theme.colors.semantic.danger.text}
            />
          </View>

          <Text style={styles.stateTitle}>Não foi possível carregar</Text>

          <Text style={styles.stateDescription}>{error}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar feed novamente"
            onPress={() => void carregarFeed()}
            style={({ pressed }) => [
              styles.stateButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Ionicons name="refresh" size={18} color={theme.colors.surface} />

            <Text style={styles.stateButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // FEED
  // ==========================================================

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={ocorrenciasFiltradas}
        keyExtractor={(item) => String(item.id_ocorrencia)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void carregarFeed("refresh")}
            tintColor={theme.colors.brand}
            colors={[theme.colors.brand]}
          />
        }
        ListHeaderComponent={
          <>
            {/* ===============================================
    HEADER
================================================ */}

            <View style={styles.header}>
              {/* =====================================================
        MENU LATERAL
    ====================================================== */}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Abrir menu"
                accessibilityHint="Abre o menu principal do PetRadar"
                hitSlop={8}
                onPress={abrirMenu}
                style={({ pressed }) => [
                  styles.headerMenuButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Ionicons
                  name="menu-outline"
                  size={24}
                  color={theme.colors.textTitle}
                />
              </Pressable>

              {/* =====================================================
        TÍTULO
    ====================================================== */}

              <View style={styles.headerContent}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  Ocorrências
                </Text>
              </View>

              {/* =====================================================
        PERFIL + RAIO
    ====================================================== */}

              <View style={styles.headerActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Abrir perfil"
                  accessibilityHint="Abre as opções da sua conta"
                  onPress={() => setProfileMenuVisible(true)}
                  style={({ pressed }) => [
                    styles.headerAvatarButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Image
                    source={{
                      uri: profilePhoto || "https://i.pravatar.cc/150?img=11",
                    }}
                    style={styles.headerAvatarImage}
                  />

                  <View style={styles.headerOnlineIndicator} />
                </Pressable>

                <View style={styles.radiusBadge}>
                  <Ionicons
                    name="navigate-outline"
                    size={13}
                    color={theme.colors.brand}
                  />

                  <Text style={styles.radiusText}>{raioPesquisaKm} km</Text>
                </View>
              </View>
            </View>
            {/* ===============================================
                BANNER
            ================================================ */}

            <View style={styles.communityBanner}>
              <View style={styles.communityIcon}>
                <MaterialCommunityIcons
                  name="heart-pulse"
                  size={24}
                  color={theme.colors.brand}
                />
              </View>

              <View style={styles.communityContent}>
                <Text style={styles.communityTitle}>
                  Juntos fazemos a diferença
                </Text>

                <Text style={styles.communityDescription}>
                  Acompanhe ocorrências próximas e ajude animais que precisam de
                  cuidado.
                </Text>
              </View>
            </View>

            {/* ===============================================
                BUSCA
            ================================================ */}

            <View style={styles.searchBox}>
              <Ionicons
                name="search-outline"
                size={19}
                color={theme.colors.textBody}
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Pesquisar animal ou local..."
                placeholderTextColor={theme.colors.textBody}
                style={styles.searchInput}
                returnKeyType="search"
              />

              {search.length > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Limpar pesquisa"
                  hitSlop={8}
                  onPress={() => setSearch("")}
                >
                  <Ionicons
                    name="close-circle"
                    size={19}
                    color={theme.colors.textBody}
                  />
                </Pressable>
              ) : null}
            </View>

            {/* ===============================================
                CABEÇALHO FEED
            ================================================ */}

            <View style={styles.feedSectionHeader}>
              <View>
                <Text style={styles.feedSectionTitle}>
                  Ocorrências próximas
                </Text>

                <Text style={styles.feedSectionSubtitle}>
                  Ordenadas da mais próxima para a mais distante
                </Text>
              </View>

              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>
                  {ocorrenciasFiltradas.length}
                </Text>
              </View>
            </View>

            {/* ===============================================
                FILTROS
            ================================================ */}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContent}
            >
              {FILTROS.map((item) => {
                const ativo = filtro === item.id;

                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Filtrar por ${item.label}`}
                    onPress={() => setFiltro(item.id)}
                    style={({ pressed }) => [
                      styles.filterChip,

                      ativo && styles.filterChipActive,

                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={15}
                      color={ativo ? theme.colors.surface : theme.colors.brand}
                    />

                    <Text
                      style={[
                        styles.filterText,

                        ativo && styles.filterTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => (
          <OccurrenceCard occurrence={item} onPress={abrirDetalheOcorrencia} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons
                name="paw-outline"
                size={34}
                color={theme.colors.brand}
              />
            </View>

            <Text style={styles.emptyTitle}>Nenhuma ocorrência encontrada</Text>

            <Text style={styles.emptyText}>
              {ocorrencias.length === 0
                ? `Não encontramos ocorrências dentro do raio de ${raioPesquisaKm} km.`
                : "Não encontramos ocorrências correspondentes à pesquisa ou ao filtro selecionado."}
            </Text>

            {(search || filtro !== "TODAS") && (
              <Pressable
                onPress={() => {
                  setSearch("");
                  setFiltro("TODAS");
                }}
                style={({ pressed }) => [
                  styles.clearButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.clearButtonText}>Limpar filtros</Text>
              </Pressable>
            )}
          </View>
        }
      />
      {/* ======================================================

    REGISTRAR OCORRÊNCIA
====================================================== */}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Registrar nova ocorrência"
        accessibilityHint="Abre o formulário para registrar um animal"
        onPress={registrarOcorrencia}
        style={({ pressed }) => [
          styles.registerButton,
          pressed && styles.registerButtonPressed,
        ]}
      >
        <View style={styles.registerButtonIcon}>
          <Ionicons name="add" size={23} color={theme.colors.brand} />
        </View>

        <View style={styles.registerButtonContent}>
          <Text style={styles.registerButtonTitle}>Registrar ocorrência</Text>

          <Text style={styles.registerButtonSubtitle}>Avise a comunidade</Text>
        </View>

        <View style={styles.registerButtonArrow}>
          <Ionicons
            name="arrow-forward"
            size={19}
            color={theme.colors.surface}
          />
        </View>
      </Pressable>

      {/* ======================================================
    MENU PRINCIPAL

    
======================================================= */}

      <AppNavigationDrawer
        visible={menuVisible}
        activeScreen="Feed"
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
    MENU RÁPIDO DO PERFIL

    [ALTERE AQUI]
======================================================= */}

<ProfileQuickMenu
    visible={
        profileMenuVisible
    }

    profilePhoto={
        profilePhoto
    }

    userName={
        user?.name || null
    }

    userEmail={
        user?.email || null
    }

    onClose={() => {
        setProfileMenuVisible(
            false,
        );
    }}

    onOpenProfile={() => {
        setProfileDetailVisible(
            true,
        );
    }}
/>

{/* ======================================================
    PERFIL COMPLETO

    [ALTERE AQUI]
======================================================= */}

<ProfileDetailScreen
    visible={
        profileDetailVisible
    }

    onClose={() => {
        setProfileDetailVisible(
            false,
        );
    }}

    onProfileUpdated={
        handleProfileUpdated
    }

    onOccurrencePress={
        abrirDetalheOcorrencia
    }
/>



      {/* ================================================
    DETALHES DA OCORRÊNCIA
================================================= */}

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

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  listContent: {
    paddingHorizontal: theme.spacing.globalMargin,
    paddingBottom: 125,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    minHeight: 82,

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 10,

    gap: 12,
  },
  // ==========================================================
  // MENU
  // ==========================================================

  headerMenuButton: {
    width: 46,
    height: 46,

    borderRadius: 23,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.surface,

    ...theme.shadows.elevation1,
  },

  // ==========================================================
  // TÍTULO
  // ==========================================================

  headerContent: {
    flex: 1,

    justifyContent: "center",

    minWidth: 0,
  },

  headerTitle: {
    color: theme.colors.textTitle,

    fontSize: 20,
    fontWeight: "900",

    letterSpacing: -0.3,
  },

  // ==========================================================
  // PERFIL + RAIO
  // ==========================================================

  headerActions: {
    alignItems: "center",
    justifyContent: "center",

    gap: 5,
  },

  headerAvatarButton: {
    width: 46,
    height: 46,

    borderRadius: 23,

    padding: 2,

    backgroundColor: theme.colors.surface,

    ...theme.shadows.elevation1,
  },

  headerAvatarImage: {
    width: "100%",
    height: "100%",

    borderRadius: 21,
  },

  headerOnlineIndicator: {
    position: "absolute",

    right: 1,
    bottom: 1,

    width: 11,
    height: 11,

    borderRadius: 6,

    backgroundColor: theme.colors.semantic.success.text,

    borderWidth: 2,
    borderColor: theme.colors.surface,
  },

  radiusBadge: {
    minHeight: 25,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 3,

    paddingHorizontal: 8,

    borderRadius: theme.radius.button,

    backgroundColor: theme.colors.semantic.success.bg,
  },

  radiusText: {
    color: theme.colors.brand,

    fontSize: 10,
    fontWeight: "800",
  },

  backButton: {
    width: 42,
    height: 42,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.surface,

    ...theme.shadows.elevation1,
  },

  //
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 7,
  },

  //
  headerPawIcon: {
    width: 25,
    height: 25,

    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.brand,
  },

  headerSubtitle: {
    marginTop: 2,

    color: theme.colors.textBody,

    fontSize: 11,
    fontWeight: "500",
  },

  // ==========================================================
  // BANNER
  // ==========================================================

  communityBanner: {
    minHeight: 92,

    flexDirection: "row",
    alignItems: "center",

    marginTop: 4,
    marginBottom: 14,

    paddingHorizontal: 16,
    paddingVertical: 15,

    borderRadius: theme.radius.card,

    backgroundColor: theme.colors.brand,

    ...theme.shadows.elevation1,
  },

  communityIcon: {
    width: 46,
    height: 46,

    borderRadius: 15,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.surface,
  },

  communityContent: {
    flex: 1,

    marginLeft: 13,
  },

  communityTitle: {
    color: theme.colors.surface,

    fontSize: 14,
    fontWeight: "900",
  },

  communityDescription: {
    marginTop: 4,

    color: theme.colors.surface,

    fontSize: 10,
    lineHeight: 15,
  },

  // ==========================================================
  // BUSCA
  // ==========================================================

  searchBox: {
    minHeight: 48,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,

    borderRadius: 15,

    backgroundColor: theme.colors.surface,

    ...theme.shadows.elevation1,
  },

  searchInput: {
    flex: 1,

    height: 48,

    marginLeft: 9,

    color: theme.colors.textTitle,

    fontSize: 13,
  },

  // ==========================================================
  // TÍTULO DO FEED
  // ==========================================================

  feedSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 22,
    marginBottom: 12,
  },

  feedSectionTitle: {
    color: theme.colors.textTitle,

    fontSize: 16,
    fontWeight: "900",
  },

  feedSectionSubtitle: {
    marginTop: 3,

    color: theme.colors.textBody,

    fontSize: 10,
  },

  counterBadge: {
    minWidth: 34,
    height: 30,

    paddingHorizontal: 9,

    borderRadius: theme.radius.button,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.inputBg,
  },

  counterText: {
    color: theme.colors.brand,

    fontSize: 11,
    fontWeight: "900",
  },

  // ==========================================================
  // FILTROS
  // ==========================================================

  filtersContent: {
    gap: 8,

    paddingBottom: 14,
    paddingRight: 6,
  },

  filterChip: {
    minHeight: 38,

    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    paddingHorizontal: 13,

    borderRadius: theme.radius.button,

    borderWidth: 1,
    borderColor: theme.colors.inputBg,

    backgroundColor: theme.colors.surface,
  },

  filterChipActive: {
    borderColor: theme.colors.brand,

    backgroundColor: theme.colors.brand,
  },

  filterText: {
    color: theme.colors.textBody,

    fontSize: 11,
    fontWeight: "700",
  },

  filterTextActive: {
    color: theme.colors.surface,
  },

  // ==========================================================
  // CARD
  // ==========================================================

  card: {
    overflow: "hidden",

    marginBottom: 17,

    borderRadius: theme.radius.card,

    backgroundColor: theme.colors.surface,

    ...theme.shadows.elevation1,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },

  imageContainer: {
    position: "relative",

    height: 215,

    backgroundColor: theme.colors.inputBg,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageFallback: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    backgroundColor: theme.colors.inputBg,
  },

  imageFallbackText: {
    color: theme.colors.textBody,

    fontSize: 11,
    fontWeight: "600",
  },

  statusBadge: {
    position: "absolute",

    top: 12,
    left: 12,

    minHeight: 30,

    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    paddingHorizontal: 10,

    borderRadius: theme.radius.button,
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "900",
  },

  distanceBadge: {
    position: "absolute",

    top: 12,
    right: 12,

    minHeight: 30,

    flexDirection: "row",
    alignItems: "center",

    gap: 4,

    paddingHorizontal: 10,

    borderRadius: theme.radius.button,

    backgroundColor: theme.colors.surface,

    ...theme.shadows.elevation1,
  },

  distanceText: {
    color: theme.colors.brand,

    fontSize: 10,
    fontWeight: "900",
  },

  cardContent: {
    padding: theme.spacing.padding,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  cardTitleContainer: {
    flex: 1,
  },

  cardTitle: {
    color: theme.colors.textTitle,

    fontSize: 16,
    fontWeight: "900",

    lineHeight: 21,
  },

  timeText: {
    marginTop: 4,

    color: theme.colors.textBody,

    fontSize: 10,
  },

  animalIcon: {
    width: 40,
    height: 40,

    marginLeft: 10,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.semantic.success.bg,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 14,
  },

  locationIcon: {
    width: 31,
    height: 31,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.inputBg,
  },

  locationText: {
    flex: 1,

    marginLeft: 9,

    color: theme.colors.textBody,

    fontSize: 11,
    lineHeight: 16,
  },

  divider: {
    height: 1,

    marginVertical: 14,

    backgroundColor: theme.colors.inputBg,
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 10,
  },

  urgencyBadge: {
    minHeight: 30,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    paddingHorizontal: 10,

    borderRadius: theme.radius.button,
  },

  urgencyText: {
    fontSize: 10,
    fontWeight: "800",
  },

  registryText: {
    color: theme.colors.textBody,

    fontSize: 9,
    fontWeight: "600",
  },

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  emptyContainer: {
    alignItems: "center",

    paddingHorizontal: 25,
    paddingVertical: 60,
  },

  emptyIcon: {
    width: 72,
    height: 72,

    borderRadius: 36,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.semantic.success.bg,
  },

  emptyTitle: {
    marginTop: 17,

    color: theme.colors.textTitle,

    fontSize: 16,
    fontWeight: "900",

    textAlign: "center",
  },

  emptyText: {
    maxWidth: 290,

    marginTop: 7,

    color: theme.colors.textBody,

    fontSize: 12,
    lineHeight: 18,

    textAlign: "center",
  },

  clearButton: {
    minHeight: 40,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 18,

    paddingHorizontal: 17,

    borderRadius: theme.radius.button,

    backgroundColor: theme.colors.inputBg,
  },

  clearButtonText: {
    color: theme.colors.brand,

    fontSize: 11,
    fontWeight: "800",
  },
  // ==========================================================
  // REGISTRAR OCORRÊNCIA
  // ==========================================================

  //
  registerButton: {
    position: "absolute",

    left: theme.spacing.globalMargin,

    right: theme.spacing.globalMargin,

    bottom: 18,

    minHeight: 66,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,

    borderRadius: 21,

    backgroundColor: theme.colors.brand,

    ...theme.shadows.buttonGlow,
  },

  registerButtonPressed: {
    transform: [
      {
        scale: 0.985,
      },
    ],

    opacity: 0.96,
  },

  registerButtonIcon: {
    width: 43,
    height: 43,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.surface,
  },

  registerButtonContent: {
    flex: 1,

    marginLeft: 11,
  },

  registerButtonTitle: {
    color: theme.colors.surface,

    fontSize: 13,
    fontWeight: "900",
  },

  registerButtonSubtitle: {
    marginTop: 2,

    color: theme.colors.surface,

    fontSize: 9,
    fontWeight: "500",
  },

  registerButtonArrow: {
    width: 38,
    height: 38,

    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.action,
  },
  // ==========================================================
  // LOADING / ERRO / LOCALIZAÇÃO
  // ==========================================================

  stateContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  stateIcon: {
    width: 76,
    height: 76,

    borderRadius: 38,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 16,

    backgroundColor: theme.colors.semantic.success.bg,
  },

  errorIcon: {
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  stateTitle: {
    marginTop: 14,

    color: theme.colors.textTitle,

    fontSize: 18,
    fontWeight: "900",

    textAlign: "center",
  },

  stateDescription: {
    maxWidth: 300,

    marginTop: 8,

    color: theme.colors.textBody,

    fontSize: 12,
    lineHeight: 19,

    textAlign: "center",
  },

  stateButton: {
    minHeight: 48,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    marginTop: 22,

    paddingHorizontal: 20,

    borderRadius: theme.radius.button,

    backgroundColor: theme.colors.brand,

    ...theme.shadows.buttonGlow,
  },

  stateButtonText: {
    color: theme.colors.surface,

    fontSize: 12,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.78,
  },
});
