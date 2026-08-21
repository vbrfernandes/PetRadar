// ============================================================
// D:\PetRadar\src\mobile\src\features\feed\screens\FeedNoticias.tsx
// ============================================================

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import * as Location from "expo-location";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import type {
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import type {
  AppTabParamList,
} from "../../../navigation/navigation.types";

import api from "../../../services/api";

import OccurrenceDetailDrawer
  from "../../occurrences/components/OccurrenceDetailDrawer";
import { occurrenceService }
  from "../../occurrences/services/occurrenceService";

import AppNavigationDrawer
  from "../../../components/AppNavigationDrawer";

import ProfileQuickMenu
  from "../../profile/components/ProfileQuickMenu";

import FeedBannerCarousel
  from "../components/FeedBannerCarousel";

import OccurrenceCard
  from "../components/OccurrenceCard";

import FeedControls
  from "../components/FeedControls";

import type {
  FiltroFeed,
  ModoFeed,
  OcorrenciaFeed,
} from "../types/feed.types";

import {
  ehUrgente,
  normalizarTexto,
} from "../utils/feed.utils";

import {
  feedButtonPressedStyle,
  feedNoticiasStyles as styles,
} from "../styles/feed.styles";

import ProfileDetailScreen
  from "../../profile/components/ProfileDetailScreen";

import type {
  ProfileUpdateResult,
} from "../../profile/types/profile.types";

import {
  theme,
} from "../../../theme/colors";

import {
  useAuthStore,
} from "../../../store/useAuthStore";

// ============================================================
// CONSTANTES
// ============================================================

const DEFAULT_SEARCH_RADIUS_KM = 10;
const MIN_SEARCH_RADIUS_KM = 1;
const MAX_SEARCH_RADIUS_KM = 100;

// ============================================================
// MOTIVOS DE DENÚNCIA
// ============================================================

const DENUNCIA_MOTIVOS = [
  {
    id: "INFORMACAO_FALSA",
    label:
      "Informação falsa ou enganosa",
  },

  {
    id: "CONTEUDO_IMPROPRIO",
    label:
      "Conteúdo impróprio",
  },

  {
    id: "SPAM_DUPLICADA",
    label:
      "Spam ou publicação duplicada",
  },

  {
    id: "OUTRO",
    label:
      "Outro problema com a publicação",
  },
] as const;

// ============================================================
// TIPAGEM
// ============================================================


interface ForcaResponse {
  ativo: boolean;
  total_forca: number;
}

type RecarregarListaOcorrencias =
  () => void | Promise<void>;

// ============================================================
// TELA
// ============================================================

export default function FeedNoticias() {
  const navigation =
    useNavigation<
      BottomTabNavigationProp<
        AppTabParamList
      >
    >();

  const user =
    useAuthStore(
      (state) =>
        state.user,
    );

  // ==========================================================
  // OCORRÊNCIA SELECIONADA
  // ==========================================================

  const [
    selectedOccurrenceId,
    setSelectedOccurrenceId,
  ] =
    useState<
      number | null
    >(null);

  // ==========================================================
  // FEED
  // ==========================================================

  const [
    ocorrencias,
    setOcorrencias,
  ] =
    useState<
      OcorrenciaFeed[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    localizacaoNegada,
    setLocalizacaoNegada,
  ] =
    useState(false);

  const [
    raioPesquisaKm,
    setRaioPesquisaKm,
  ] =
    useState(
      DEFAULT_SEARCH_RADIUS_KM,
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    filtro,
    setFiltro,
  ] =
    useState<FiltroFeed>(
      "TODAS",
    );

  const [
    modoFeed,
    setModoFeed,
  ] =
    useState<ModoFeed>(
      "PROXIMIDADE",
    );

  const modoFeedRef =
    useRef<ModoFeed>(
      "PROXIMIDADE",
    );

  // ==========================================================
  // ECO (FORÇA NO BACKEND)
  // ==========================================================

  const [
    forcasEmAndamento,
    setForcasEmAndamento,
  ] =
    useState<
      Set<number>
    >(
      () =>
        new Set<number>(),
    );

  const forcasEmAndamentoRef =
    useRef<
      Set<number>
    >(
      new Set<number>(),
    );

  // ==========================================================
  // LISTA QUE ORIGINOU A ABERTURA DA OCORRÊNCIA
  // ==========================================================

  const recarregarListaOrigemRef =
    useRef<
      RecarregarListaOcorrencias
      | null
    >(null);

  // ==========================================================
  // NAVEGAÇÃO / PERFIL
  // ==========================================================

  const [
    menuVisible,
    setMenuVisible,
  ] =
    useState(false);

  const [
    profileMenuVisible,
    setProfileMenuVisible,
  ] =
    useState(false);

  const [
    profilePhoto,
    setProfilePhoto,
  ] =
    useState<
      string | null
    >(null);

  const [
    profileDetailVisible,
    setProfileDetailVisible,
  ] =
    useState(false);

  // ==========================================================
  // DENÚNCIA
  // ==========================================================

  const [
    denunciaOccurrenceId,
    setDenunciaOccurrenceId,
  ] =
    useState<
      number | null
    >(null);

  const [
    enviandoDenuncia,
    setEnviandoDenuncia,
  ] =
    useState(false);

  // ==========================================================
  // CARREGAR FEED
  // ==========================================================

  const carregarFeed =
    useCallback(
      async (
        modo:
          | "normal"
          | "refresh" =
          "normal",

        modoSelecionado:
          ModoFeed =
          modoFeedRef.current,
      ) => {
        if (
          modo ===
          "refresh"
        ) {
          setRefreshing(
            true,
          );
        } else {
          setLoading(
            true,
          );
        }

        setError(
          null,
        );

        try {
          // ==================================================
          // 1. RAIO DO PERFIL
          // ==================================================

          let raioAtual =
            DEFAULT_SEARCH_RADIUS_KM;

          try {
            const profileResponse =
              await api.get(
                "/auth/me",
              );

            setProfilePhoto(
              profileResponse
                .data
                ?.foto_perfil ??
              null,
            );

            const raioRecebido =
              Number(
                profileResponse
                  .data
                  ?.raio_pesquisa_km,
              );

            if (
              Number.isFinite(
                raioRecebido,
              )
            ) {
              raioAtual =
                Math.min(
                  MAX_SEARCH_RADIUS_KM,

                  Math.max(
                    MIN_SEARCH_RADIUS_KM,
                    raioRecebido,
                  ),
                );
            }
          } catch (
          profileError
          ) {
            console.warn(
              "[FeedNoticias] Não foi possível carregar o raio do perfil:",
              profileError,
            );
          }

          setRaioPesquisaKm(
            raioAtual,
          );

          // ==================================================
          // 2. PERMISSÃO DE LOCALIZAÇÃO
          // ==================================================

          const {
            status,
          } =
            await Location
              .requestForegroundPermissionsAsync();

          if (
            status !==
            "granted"
          ) {
            setLocalizacaoNegada(
              true,
            );

            setOcorrencias(
              [],
            );

            return;
          }

          setLocalizacaoNegada(
            false,
          );

          // ==================================================
          // 3. LOCALIZAÇÃO ATUAL
          // ==================================================

          const currentLocation =
            await Location
              .getCurrentPositionAsync(
                {
                  accuracy:
                    Location
                      .Accuracy
                      .Balanced,
                },
              );

          // ==================================================
          // 4. OCORRÊNCIAS DO FEED
          // ==================================================

          const response =
            await occurrenceService.getNearby<OcorrenciaFeed>({
              lat:
                currentLocation
                  .coords
                  .latitude,

              lng:
                currentLocation
                  .coords
                  .longitude,

              raio_km:
                raioAtual,

              modo:
                modoSelecionado ===
                  "ECO"
                  ? "eco"
                  : "proximidade",
            });

          const dados =
            Array.isArray(
              response.data,
            )
              ? response.data
              : [];

          const ocorrenciasValidas =
            dados.filter(
              (
                occurrence,
              ) =>
                Number.isFinite(
                  Number(
                    occurrence
                      .latitude,
                  ),
                ) &&
                Number.isFinite(
                  Number(
                    occurrence
                      .longitude,
                  ),
                ),
            );



          setOcorrencias(
            ocorrenciasValidas,
          );
        } catch (
        err: unknown
        ) {
          console.warn(
            "[FeedNoticias] Erro ao carregar feed:",
            err,
          );

          setOcorrencias(
            [],
          );

          setError(
            modoSelecionado ===
              "ECO"
              ? "Não foi possível carregar as ocorrências do modo Eco."
              : "Não foi possível carregar as ocorrências próximas.",
          );
        } finally {
          setLoading(
            false,
          );

          setRefreshing(
            false,
          );
        }
      },
      [],
    );

  // ==========================================================
  // ATUALIZAR AO ENTRAR NA TELA
  // ==========================================================

  useFocusEffect(
    useCallback(
      () => {
        const atualizarFeed =
          async () => {
            await carregarFeed();

            const recarregarListaOrigem =
              recarregarListaOrigemRef
                .current;

            if (
              !recarregarListaOrigem
            ) {
              return;
            }

            recarregarListaOrigemRef.current =
              null;

            await recarregarListaOrigem();
          };

        void atualizarFeed();
      },
      [
        carregarFeed,
      ],
    ),
  );

  // ==========================================================
  // PERFIL ATUALIZADO
  // ==========================================================

  const handleProfileUpdated =
    useCallback(
      (
        updatedProfile:
          ProfileUpdateResult,
      ) => {
        if (
          updatedProfile
            .foto_perfil !==
          undefined
        ) {
          setProfilePhoto(
            updatedProfile
              .foto_perfil ??
            null,
          );
        }

        void carregarFeed();
      },
      [
        carregarFeed,
      ],
    );

  // ==========================================================
  // DETALHES DA OCORRÊNCIA
  // ==========================================================

  const abrirDetalheOcorrencia =
    useCallback(
      (
        occurrenceId:
          number,

        recarregarLista?:
          RecarregarListaOcorrencias,
      ) => {
        recarregarListaOrigemRef.current =
          recarregarLista ??
          null;

        setSelectedOccurrenceId(
          occurrenceId,
        );
      },
      [],
    );

  const handleOccurrenceEdit =
    useCallback(
      (
        occurrenceId:
          number,
      ) => {
        navigation.navigate(
          "CadastroOcorrencia",

          {
            ocorrenciaId:
              occurrenceId,
          },
        );
      },
      [
        navigation,
      ],
    );

  const handleOccurrenceDeleted =
    useCallback(
      async (
        occurrenceId:
          number,
      ) => {
        // ====================================================
        // 1. REMOVE DO FEED IMEDIATAMENTE
        // ====================================================

        setOcorrencias(
          (
            atuais,
          ) =>
            atuais.filter(
              (
                occurrence,
              ) =>
                occurrence
                  .id_ocorrencia !==
                occurrenceId,
            ),
        );

        // ====================================================
        // 2. LISTA DE ORIGEM
        // ====================================================

        const recarregarListaOrigem =
          recarregarListaOrigemRef
            .current;

        recarregarListaOrigemRef.current =
          null;

        // ====================================================
        // 3. ATUALIZA LISTAS
        // ====================================================

        const atualizacoes:
          Promise<unknown>[] =
          [
            carregarFeed(
              "refresh",
            ),
          ];

        if (
          recarregarListaOrigem
        ) {
          atualizacoes.push(
            Promise
              .resolve()
              .then(
                recarregarListaOrigem,
              ),
          );
        }

        await Promise
          .allSettled(
            atualizacoes,
          );
      },
      [
        carregarFeed,
      ],
    );

  // ==========================================================
  // FORÇA
  // ==========================================================

  const alternarForca =
    useCallback(
      async (
        occurrenceId:
          number,
      ) => {
        // Impede duplo clique enquanto
        // a requisição está em andamento.

        if (
          forcasEmAndamentoRef
            .current
            .has(
              occurrenceId,
            )
        ) {
          return;
        }

        forcasEmAndamentoRef
          .current
          .add(
            occurrenceId,
          );

        setForcasEmAndamento(
          new Set(
            forcasEmAndamentoRef
              .current,
          ),
        );

        try {
          const response =
            await api.post<
              ForcaResponse
            >(
              `/ocorrencias/${occurrenceId}/forca`,
            );

          const {
            ativo,
            total_forca,
          } =
            response.data;

          setOcorrencias(
            (
              atuais,
            ) =>
              atuais.map(
                (
                  occurrence,
                ) => {
                  if (
                    occurrence
                      .id_ocorrencia !==
                    occurrenceId
                  ) {
                    return occurrence;
                  }

                  return {
                    ...occurrence,

                    usuario_deu_forca:
                      Boolean(
                        ativo,
                      ),

                    total_forca:
                      Math.max(
                        0,

                        Number(
                          total_forca,
                        ) || 0,
                      ),
                  };
                },
              ),
          );
        } catch (
        err: unknown
        ) {
          console.warn(
            "[FeedNoticias] Erro ao atualizar Eco:",
            err,
          );

          Alert.alert(
            "Não foi possível atualizar",
            "Tente Ecoar novamente em alguns instantes.",
          );
        } finally {
          forcasEmAndamentoRef
            .current
            .delete(
              occurrenceId,
            );

          setForcasEmAndamento(
            new Set(
              forcasEmAndamentoRef
                .current,
            ),
          );
        }
      },
      [],
    );

  // ==========================================================
  // OPÇÕES / DENÚNCIA
  // ==========================================================

  const abrirOpcoesOcorrencia =
    useCallback(
      (
        occurrenceId:
          number,
      ) => {
        setDenunciaOccurrenceId(
          occurrenceId,
        );
      },
      [],
    );

  const fecharDenuncia =
    useCallback(
      () => {
        if (
          enviandoDenuncia
        ) {
          return;
        }

        setDenunciaOccurrenceId(
          null,
        );
      },
      [
        enviandoDenuncia,
      ],
    );

  const enviarDenuncia =
    useCallback(
      async (
        motivo:
          string,
      ) => {
        if (
          denunciaOccurrenceId ===
          null ||
          enviandoDenuncia
        ) {
          return;
        }

        setEnviandoDenuncia(
          true,
        );

        try {
          await api.post(
            `/ocorrencias/${denunciaOccurrenceId}/denuncias`,

            {
              motivo,
            },
          );

          setDenunciaOccurrenceId(
            null,
          );

          Alert.alert(
            "Denúncia enviada",
            "Obrigado. A ocorrência foi sinalizada para análise.",
          );
        } catch (
        err: unknown
        ) {
          console.warn(
            "[FeedNoticias] Erro ao denunciar ocorrência:",
            err,
          );

          Alert.alert(
            "Não foi possível enviar",
            "Não conseguimos registrar a denúncia agora. Tente novamente em alguns instantes.",
          );
        } finally {
          setEnviandoDenuncia(
            false,
          );
        }
      },
      [
        denunciaOccurrenceId,
        enviandoDenuncia,
      ],
    );


  // ==========================================================
  // NAVEGAÇÃO DO FEED
  // ==========================================================

  const abrirMenu =
    useCallback(
      () => {
        setMenuVisible(
          true,
        );
      },
      [],
    );

  const fecharMenu =
    useCallback(
      () => {
        setMenuVisible(
          false,
        );
      },
      [],
    );

  const registrarOcorrencia =
    useCallback(
      () => {
        navigation.navigate(
          "CadastroOcorrencia",
        );
      },
      [
        navigation,
      ],
    );

  const selecionarModoFeed =
    useCallback(
      (
        novoModo:
          ModoFeed,
      ) => {
        if (
          modoFeedRef.current ===
          novoModo ||
          refreshing
        ) {
          return;
        }

        modoFeedRef.current =
          novoModo;

        setModoFeed(
          novoModo,
        );

        void carregarFeed(
          "refresh",
          novoModo,
        );
      },
      [
        carregarFeed,
        refreshing,
      ],
    );

  // ==========================================================
  // BUSCA + FILTROS
  // ==========================================================

  const ocorrenciasFiltradas =
    useMemo(
      () => {
        const termo =
          modoFeed ===
            "PROXIMIDADE"
            ? normalizarTexto(
              search,
            )
            : "";

        return ocorrencias.filter(
          (
            occurrence,
          ) => {
            const correspondeBusca =
              !termo ||
              [
                occurrence
                  .tipo_animal,

                occurrence
                  .tipo_ocorrencia,

                occurrence
                  .status_badge,

                occurrence
                  .nivel_urgencia,

                occurrence
                  .endereco_localizacao,

                occurrence
                  .observacao,

                occurrence
                  .autor_nome,
              ].some(
                (
                  valor,
                ) =>
                  normalizarTexto(
                    valor,
                  ).includes(
                    termo,
                  ),
              );

            if (
              !correspondeBusca
            ) {
              return false;
            }

            const status =
              normalizarTexto(
                occurrence
                  .status_badge,
              );

            switch (
            filtro
            ) {
              case "PERDIDOS":
                return status
                  .includes(
                    "perdid",
                  );

              case "AVISTADOS":
                return status
                  .includes(
                    "avist",
                  );

              case "RUA":
                return (
                  status.includes(
                    "rua",
                  ) ||
                  normalizarTexto(
                    occurrence
                      .tipo_ocorrencia,
                  ).includes(
                    "animal_de_rua",
                  )
                );

              case "URGENTES":
                return ehUrgente(
                  occurrence
                    .nivel_urgencia,
                );

              case "TODAS":

              default:
                return true;
            }
          },
        );
      },
      [
        ocorrencias,
        search,
        filtro,
        modoFeed,
      ],
    );

  // ==========================================================
  // LOADING INICIAL
  // ==========================================================

  if (loading) {
    return (
      <SafeAreaView
        style={
          styles.container
        }
      >
        <View
          style={
            styles.stateContainer
          }
        >
          <View
            style={
              styles.stateIcon
            }
          >
            <MaterialCommunityIcons
              name="paw"
              size={35}
              color={
                theme.colors
                  .brand
              }
            />
          </View>

          <ActivityIndicator
            size="small"
            color={
              theme.colors
                .brand
            }
          />

          <Text
            style={
              styles.stateTitle
            }
          >
            Buscando ocorrências
          </Text>

          <Text
            style={
              styles.stateDescription
            }
          >
            Estamos procurando animais próximos da sua localização.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // LOCALIZAÇÃO NEGADA
  // ==========================================================

  if (
    localizacaoNegada
  ) {
    return (
      <SafeAreaView
        style={
          styles.container
        }
      >
        <View
          style={
            styles.stateContainer
          }
        >
          <View
            style={
              styles.stateIcon
            }
          >
            <Ionicons
              name="location-outline"
              size={34}
              color={
                theme.colors
                  .brand
              }
            />
          </View>

          <Text
            style={
              styles.stateTitle
            }
          >
            Localização necessária
          </Text>

          <Text
            style={
              styles.stateDescription
            }
          >
            Precisamos da sua localização para mostrar as ocorrências mais próximas de você.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tentar permitir localização novamente"
            onPress={() =>
              void carregarFeed()
            }
            style={({
              pressed,
            }) => [
                styles.stateButton,

                pressed &&
                feedButtonPressedStyle,
              ]}
          >
            <Ionicons
              name="location"
              size={18}
              color={
                theme.colors
                  .surface
              }
            />

            <Text
              style={
                styles.stateButtonText
              }
            >
              Tentar novamente
            </Text>
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
      <SafeAreaView
        style={
          styles.container
        }
      >
        <View
          style={
            styles.stateContainer
          }
        >
          <View
            style={[
              styles.stateIcon,
              styles.errorIcon,
            ]}
          >
            <Ionicons
              name="cloud-offline-outline"
              size={34}
              color={
                theme.colors
                  .semantic
                  .danger
                  .text
              }
            />
          </View>

          <Text
            style={
              styles.stateTitle
            }
          >
            Não foi possível carregar
          </Text>

          <Text
            style={
              styles.stateDescription
            }
          >
            {error}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar feed novamente"
            onPress={() =>
              void carregarFeed()
            }
            style={({
              pressed,
            }) => [
                styles.stateButton,

                pressed &&
                feedButtonPressedStyle,
              ]}
          >
            <Ionicons
              name="refresh"
              size={18}
              color={
                theme.colors
                  .surface
              }
            />

            <Text
              style={
                styles.stateButtonText
              }
            >
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // FEED
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <FlatList
        data={
          ocorrenciasFiltradas
        }
        keyExtractor={(
          item,
        ) =>
          String(
            item.id_ocorrencia,
          )
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={() =>
              void carregarFeed(
                "refresh",
              )
            }
            tintColor={
              theme.colors
                .brand
            }
            colors={[
              theme.colors
                .brand,
            ]}
          />
        }

        // =====================================================
        // CABEÇALHO
        // =====================================================

        ListHeaderComponent={
          <>
            {/* =================================================
                HEADER
            ================================================= */}

            <View
              style={
                styles.header
              }
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Abrir menu"
                accessibilityHint="Abre o menu principal do PetRadar"
                hitSlop={8}
                onPress={
                  abrirMenu
                }
                style={({
                  pressed,
                }) => [
                    styles.headerMenuButton,

                    pressed &&
                    feedButtonPressedStyle,
                  ]}
              >
                <Ionicons
                  name="menu-outline"
                  size={24}
                  color={
                    theme.colors
                      .textTitle
                  }
                />
              </Pressable>

              <View
                style={
                  styles.headerContent
                }
              >
                <Text
                  style={
                    styles.headerTitle
                  }
                  numberOfLines={1}
                >
                  Ocorrências
                </Text>
              </View>

              <View
                style={
                  styles.headerActions
                }
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Abrir perfil"
                  accessibilityHint="Abre as opções da sua conta"
                  onPress={() =>
                    setProfileMenuVisible(
                      true,
                    )
                  }
                  style={({
                    pressed,
                  }) => [
                      styles.headerAvatarButton,

                      pressed &&
                      feedButtonPressedStyle,
                    ]}
                >
                  <Image
                    source={{
                      uri:
                        profilePhoto ||
                        "https://i.pravatar.cc/150?img=11",
                    }}
                    style={
                      styles.headerAvatarImage
                    }
                  />

                  <View
                    style={
                      styles.headerOnlineIndicator
                    }
                  />
                </Pressable>

                <View
                  style={
                    styles.radiusBadge
                  }
                >
                  <Ionicons
                    name={
                      modoFeed ===
                        "ECO"
                        ? "earth-outline"
                        : "navigate-outline"
                    }
                    size={13}
                    color={
                      theme.colors
                        .brand
                    }
                  />

                  <Text
                    style={
                      styles.radiusText
                    }
                  >
                    {modoFeed ===
                      "ECO"
                      ? "Mundo"
                      : `${raioPesquisaKm} km`}
                  </Text>
                </View>
              </View>
            </View>

            {/* =================================================
                CARROSSEL DE BANNERS
            ================================================= */}

            <FeedBannerCarousel />

            {/* =================================================
                CARROSSEL: BUSCA / MODOS DO FEED
            ================================================= */}

            <FeedControls
              search={
                search
              }
              modoFeed={
                modoFeed
              }
              filtro={
                filtro
              }
              raioPesquisaKm={
                raioPesquisaKm
              }
              refreshing={
                refreshing
              }
              quantidadeOcorrenciasFiltradas={
                ocorrenciasFiltradas
                  .length
              }
              onSearchChange={
                setSearch
              }
              onSelectMode={
                selecionarModoFeed
              }
              onFilterChange={
                setFiltro
              }
            />
          </>
        }

        // =====================================================
        // CARD
        // =====================================================

        renderItem={({
          item,
        }) => (
          <OccurrenceCard
            occurrence={
              item
            }
            forcaLoading={
              forcasEmAndamento.has(
                item.id_ocorrencia,
              )
            }
            onPress={
              abrirDetalheOcorrencia
            }
            onToggleForca={
              alternarForca
            }
            onOpenOptions={
              abrirOpcoesOcorrencia
            }
          />
        )}

        // =====================================================
        // LISTA VAZIA
        // =====================================================

        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <View
              style={
                styles.emptyIcon
              }
            >
              <MaterialCommunityIcons
                name="paw-outline"
                size={34}
                color={
                  theme.colors
                    .brand
                }
              />
            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              Nenhuma ocorrência encontrada
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              {ocorrencias.length ===
                0
                ? modoFeed ===
                  "ECO"
                  ? "Não encontramos ocorrências disponíveis no modo Eco."
                  : `Não encontramos ocorrências dentro do raio de ${raioPesquisaKm} km.`
                : "Não encontramos ocorrências correspondentes à pesquisa ou ao filtro selecionado."}
            </Text>

            {((modoFeed ===
              "PROXIMIDADE" &&
              search) ||
              filtro !==
              "TODAS") && (
                <Pressable
                  onPress={() => {
                    setSearch(
                      "",
                    );

                    setFiltro(
                      "TODAS",
                    );
                  }}
                  style={({
                    pressed,
                  }) => [
                      styles.clearButton,

                      pressed &&
                      feedButtonPressedStyle,
                    ]}
                >
                  <Text
                    style={
                      styles.clearButtonText
                    }
                  >
                    Limpar filtros
                  </Text>
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
        onPress={
          registrarOcorrencia
        }
        style={({
          pressed,
        }) => [
            styles.registerButton,

            pressed &&
            styles.registerButtonPressed,
          ]}
      >
        <View
          style={
            styles.registerButtonIcon
          }
        >
          <Ionicons
            name="add"
            size={23}
            color={
              theme.colors
                .brand
            }
          />
        </View>

        <View
          style={
            styles.registerButtonContent
          }
        >
          <Text
            style={
              styles.registerButtonTitle
            }
          >
            Registrar ocorrência
          </Text>

          <Text
            style={
              styles.registerButtonSubtitle
            }
          >
            Avise a comunidade
          </Text>
        </View>

        <View
          style={
            styles.registerButtonArrow
          }
        >
          <Ionicons
            name="arrow-forward"
            size={19}
            color={
              theme.colors
                .surface
            }
          />
        </View>
      </Pressable>

      {/* ======================================================
          DENÚNCIA DA PUBLICAÇÃO
      ====================================================== */}

      <Modal
        visible={
          denunciaOccurrenceId !==
          null
        }
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={
          fecharDenuncia
        }
      >
        <View
          style={
            styles.reportOverlay
          }
        >
          {/* Área externa fecha o modal */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar denúncia"
            onPress={
              fecharDenuncia
            }
            style={
              styles.reportBackdrop
            }
          />

          <View
            style={
              styles.reportSheet
            }
          >
            <View
              style={
                styles.reportHandle
              }
            />

            <View
              style={
                styles.reportHeader
              }
            >
              <View
                style={
                  styles.reportHeaderIcon
                }
              >
                <Ionicons
                  name="flag-outline"
                  size={21}
                  color={
                    theme.colors
                      .semantic
                      .danger
                      .text
                  }
                />
              </View>

              <View
                style={
                  styles.reportHeaderContent
                }
              >
                <Text
                  style={
                    styles.reportTitle
                  }
                >
                  Denunciar publicação
                </Text>

                <Text
                  style={
                    styles.reportDescription
                  }
                >
                  Selecione o motivo da denúncia.
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar"
                disabled={
                  enviandoDenuncia
                }
                onPress={
                  fecharDenuncia
                }
                hitSlop={8}
                style={({
                  pressed,
                }) => [
                    styles.reportCloseButton,

                    pressed &&
                    feedButtonPressedStyle,
                  ]}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={
                    theme.colors
                      .textBody
                  }
                />
              </Pressable>
            </View>

            {enviandoDenuncia ? (
              <View
                style={
                  styles.reportLoading
                }
              >
                <ActivityIndicator
                  size="small"
                  color={
                    theme.colors
                      .brand
                  }
                />

                <Text
                  style={
                    styles.reportLoadingText
                  }
                >
                  Enviando denúncia...
                </Text>
              </View>
            ) : (
              <View
                style={
                  styles.reportReasons
                }
              >
                {DENUNCIA_MOTIVOS.map(
                  (
                    motivo,
                  ) => (
                    <Pressable
                      key={
                        motivo.id
                      }
                      accessibilityRole="button"
                      accessibilityLabel={
                        motivo.label
                      }
                      onPress={() =>
                        void enviarDenuncia(
                          motivo.label,
                        )
                      }
                      style={({
                        pressed,
                      }) => [
                          styles.reportReasonButton,

                          pressed &&
                          styles.reportReasonButtonPressed,
                        ]}
                    >
                      <View
                        style={
                          styles.reportReasonIcon
                        }
                      >
                        <Ionicons
                          name="flag-outline"
                          size={17}
                          color={
                            theme.colors
                              .textBody
                          }
                        />
                      </View>

                      <Text
                        style={
                          styles.reportReasonText
                        }
                      >
                        {motivo.label}
                      </Text>

                      <Ionicons
                        name="chevron-forward"
                        size={17}
                        color={
                          theme.colors
                            .textBody
                        }
                      />
                    </Pressable>
                  ),
                )}
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancelar denúncia"
              disabled={
                enviandoDenuncia
              }
              onPress={
                fecharDenuncia
              }
              style={({
                pressed,
              }) => [
                  styles.reportCancelButton,

                  pressed &&
                  feedButtonPressedStyle,
                ]}
            >
              <Text
                style={
                  styles.reportCancelText
                }
              >
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ======================================================
          MENU PRINCIPAL
      ====================================================== */}

      <AppNavigationDrawer
        visible={
          menuVisible
        }
        activeScreen="Feed"
        profilePhoto={
          profilePhoto
        }
        userName={
          user?.name ||
          null
        }
        userEmail={
          user?.email ||
          null
        }
        onClose={
          fecharMenu
        }
        onNavigateMap={() => {
          navigation.navigate(
            "Mapa",
          );
        }}
        onNavigateFeed={() => {
          navigation.navigate(
            "Feed",
          );
        }}
        onNavigateProcuraSe={() => {
          navigation.navigate(
            "ProcuraSe",
          );
        }}
      />

      {/* ======================================================
          MENU RÁPIDO DO PERFIL
      ====================================================== */}

      <ProfileQuickMenu
        visible={
          profileMenuVisible
        }
        profilePhoto={
          profilePhoto
        }
        userName={
          user?.name ||
          null
        }
        userEmail={
          user?.email ||
          null
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
      ====================================================== */}

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

      {/* ======================================================
          DETALHES DA OCORRÊNCIA
      ====================================================== */}

      <OccurrenceDetailDrawer
        visible={
          selectedOccurrenceId !==
          null
        }
        occurrenceId={
          selectedOccurrenceId
        }
        onClose={() =>
          setSelectedOccurrenceId(
            null,
          )
        }
        onEdit={
          handleOccurrenceEdit
        }
        onDeleted={
          handleOccurrenceDeleted
        }
      />
    </SafeAreaView>
  );
}