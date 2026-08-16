// ============================================================
// D:\PetRadar\src\mobile\src\screens\FeedNoticias.tsx
// ============================================================

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
} from "../../App";

import api from "../services/api";

import OccurrenceDetailDrawer
  from "../components/OccurrenceDetailDrawer";

import AppNavigationDrawer
  from "../components/AppNavigationDrawer";

import ProfileQuickMenu
  from "../components/ProfileQuickMenu";

import FeedBannerCarousel
  from "../components/FeedBannerCarousel";

import ProfileDetailScreen, {
  type ProfileUpdateResult,
} from "./ProfileDetailScreen";

import {
  theme,
} from "../theme/colors";

import {
  useAuthStore,
} from "../store/useAuthStore";

// ============================================================
// CONSTANTES
// ============================================================

const DEFAULT_SEARCH_RADIUS_KM = 10;
const MIN_SEARCH_RADIUS_KM = 1;
const MAX_SEARCH_RADIUS_KM = 100;

const FEED_MODE_CAROUSEL_WIDTH =
  Dimensions.get("window").width -
  theme.spacing.globalMargin * 2;

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

interface OcorrenciaFeed {
  id_ocorrencia: number;
  id_conta: number;

  tipo_ocorrencia: string;
  status_badge: string;
  tipo_animal: string;

  foto: string;

  nivel_urgencia: string;
  data_ocorrencia: string;

  endereco_localizacao?:
  | string
  | null;

  observacao?:
  | string
  | null;

  latitude: number;
  longitude: number;

  distancia_km?:
  | number
  | null;

  autor_nome?:
  | string
  | null;

  autor_foto?:
  | string
  | null;

  total_forca?: number;
  total_comentarios?: number;

  usuario_deu_forca?: boolean;
}

interface ForcaResponse {
  ativo: boolean;
  total_forca: number;
}

type RecarregarListaOcorrencias =
  () => void | Promise<void>;

type FiltroFeed =
  | "TODAS"
  | "PERDIDOS"
  | "AVISTADOS"
  | "RUA"
  | "URGENTES";

type ModoFeed =
  | "PROXIMIDADE"
  | "ECO";


interface FiltroConfig {
  id: FiltroFeed;

  label: string;

  icon:
  keyof typeof Ionicons.glyphMap;
}

interface StatusVisual {
  label: string;

  textColor: string;

  backgroundColor: string;
}

interface OccurrenceCardProps {
  occurrence: OcorrenciaFeed;

  forcaLoading: boolean;

  onPress:
  (occurrenceId: number) => void;

  onToggleForca:
  (occurrenceId: number) => void;

  onOpenOptions:
  (occurrenceId: number) => void;
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

function normalizarTexto(
  valor:
    | string
    | null
    | undefined,
) {
  return (valor ?? "")
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    );
}

function capitalizar(
  valor: string,
) {
  const texto = valor
    .trim()
    .toLocaleLowerCase()
    .replace(
      /_/g,
      " ",
    );

  if (!texto) {
    return "Animal";
  }

  return (
    texto
      .charAt(0)
      .toLocaleUpperCase() +
    texto.slice(1)
  );
}

function formatarDistancia(
  distanciaKm:
    | number
    | null
    | undefined,
) {
  const distancia =
    Number(distanciaKm);

  if (
    !Number.isFinite(distancia) ||
    distancia < 0
  ) {
    return "Distância indisponível";
  }

  if (distancia < 1) {
    return `${Math.round(
      distancia * 1000,
    )} m`;
  }

  return `${distancia.toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
  )} km`;
}

function formatarTempoRelativo(
  data: string,
) {
  const date = new Date(
    data,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Data não informada";
  }

  const diferencaMs =
    Date.now() -
    date.getTime();

  if (diferencaMs <= 0) {
    return "Agora";
  }

  const minutos =
    Math.floor(
      diferencaMs /
      (1000 * 60),
    );

  if (minutos < 1) {
    return "Agora";
  }

  if (minutos < 60) {
    return `há ${minutos} min`;
  }

  const horas =
    Math.floor(
      minutos / 60,
    );

  if (horas < 24) {
    return horas === 1
      ? "há 1 hora"
      : `há ${horas} horas`;
  }

  const dias =
    Math.floor(
      horas / 24,
    );

  if (dias < 7) {
    return dias === 1
      ? "há 1 dia"
      : `há ${dias} dias`;
  }

  return date.toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );
}

function obterStatusVisual(
  occurrence: OcorrenciaFeed,
): StatusVisual {
  const status =
    normalizarTexto(
      occurrence.status_badge,
    );

  if (
    status.includes(
      "perdid",
    )
  ) {
    return {
      label: "Perdido",

      textColor:
        theme.colors.semantic
          .danger.text,

      backgroundColor:
        theme.colors.semantic
          .danger.bg,
    };
  }

  if (
    status.includes(
      "avist",
    )
  ) {
    return {
      label: "Avistado",

      textColor:
        theme.colors.semantic
          .warning.text,

      backgroundColor:
        theme.colors.semantic
          .warning.bg,
    };
  }

  return {
    label: "Animal de rua",

    textColor:
      theme.colors.semantic
        .success.text,

    backgroundColor:
      theme.colors.semantic
        .success.bg,
  };
}

function obterTituloOcorrencia(
  occurrence: OcorrenciaFeed,
) {
  const animal =
    capitalizar(
      occurrence.tipo_animal,
    );

  const status =
    normalizarTexto(
      occurrence.status_badge,
    );

  if (
    status.includes(
      "perdid",
    )
  ) {
    return `${animal} perdido`;
  }

  if (
    status.includes(
      "avist",
    )
  ) {
    return `${animal} avistado`;
  }

  return `${animal} precisa de ajuda`;
}

function ehUrgente(
  nivelUrgencia: string,
) {
  const urgencia =
    normalizarTexto(
      nivelUrgencia,
    );

  return (
    urgencia.includes(
      "alta",
    ) ||
    urgencia.includes(
      "crit",
    )
  );
}

function obterDescricaoOcorrencia(
  occurrence: OcorrenciaFeed,
) {
  const observacao =
    occurrence.observacao
      ?.trim();

  if (observacao) {
    return observacao;
  }

  const titulo =
    obterTituloOcorrencia(
      occurrence,
    );

  const endereco =
    occurrence
      .endereco_localizacao
      ?.trim();

  if (endereco) {
    return `${titulo}. Localização: ${endereco}.`;
  }

  return `${titulo}. Abra os detalhes para ver todas as informações desta ocorrência.`;
}

function obterIniciais(
  nome:
    | string
    | null
    | undefined,
) {
  const partes =
    (nome ?? "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (
    partes.length === 0
  ) {
    return "PR";
  }

  if (
    partes.length === 1
  ) {
    return partes[0]
      .slice(0, 2)
      .toLocaleUpperCase();
  }

  return (
    partes[0].charAt(0) +
    partes[
      partes.length - 1
    ].charAt(0)
  ).toLocaleUpperCase();
}

function formatarQuantidadeComentarios(
  total:
    | number
    | null
    | undefined,
) {
  const quantidade =
    Number.isFinite(
      Number(total),
    )
      ? Math.max(
        0,
        Number(total),
      )
      : 0;

  return quantidade === 1
    ? "1 comentário"
    : `${quantidade} comentários`;
}

// ============================================================
// CARD DA OCORRÊNCIA
// ============================================================

function OccurrenceCard({
  occurrence,

  forcaLoading,

  onPress,

  onToggleForca,

  onOpenOptions,
}: OccurrenceCardProps) {
  const status =
    obterStatusVisual(
      occurrence,
    );

  const fotoValida =
    typeof occurrence.foto ===
    "string" &&
    occurrence.foto
      .trim()
      .length > 0;

  const autorNome =
    occurrence.autor_nome
      ?.trim() ||
    "Usuário PetRadar";

  const autorFoto =
    occurrence.autor_foto
      ?.trim() ||
    null;

  const usuarioDeuForca =
    Boolean(
      occurrence
        .usuario_deu_forca,
    );

  const totalForca =
    Math.max(
      0,
      Number(
        occurrence
          .total_forca ?? 0,
      ),
    );

  const descricao =
    obterDescricaoOcorrencia(
      occurrence,
    );

  // ==========================================================
  // ANIMAÇÃO DO ECO
  // ==========================================================
  //
  // A animação acontece somente quando o estado recebido
  // do backend muda.
  //
  // false -> true:
  // gira uma volta e dá um pequeno pulso.
  //
  // true -> false:
  // apenas retrai levemente.
  // ==========================================================

  const echoRotation =
    useRef(
      new Animated.Value(0),
    ).current;

  const echoScale =
    useRef(
      new Animated.Value(1),
    ).current;

  const previousEchoState =
    useRef(
      usuarioDeuForca,
    );

  useEffect(
    () => {
      const previousState =
        previousEchoState.current;

      // Não anima na primeira renderização
      // nem em renders onde o estado não mudou.
      if (
        previousState ===
        usuarioDeuForca
      ) {
        return;
      }

      previousEchoState.current =
        usuarioDeuForca;

      echoRotation.stopAnimation();

      echoScale.stopAnimation();

      // ======================================================
      // ECO REGISTRADO
      // ======================================================

      if (
        usuarioDeuForca
      ) {
        echoRotation.setValue(
          0,
        );

        echoScale.setValue(
          1,
        );

        Animated.parallel([
          Animated.timing(
            echoRotation,
            {
              toValue: 1,

              duration: 1680,

              easing:
                Easing.out(
                  Easing.cubic,
                ),

              useNativeDriver:
                true,
            },
          ),

          Animated.sequence([
            Animated.timing(
              echoScale,
              {
                toValue: 1.13,

                duration: 150,

                easing:
                  Easing.out(
                    Easing.cubic,
                  ),

                useNativeDriver:
                  true,
              },
            ),

            Animated.timing(
              echoScale,
              {
                toValue: 1,

                duration: 190,

                easing:
                  Easing.out(
                    Easing.cubic,
                  ),

                useNativeDriver:
                  true,
              },
            ),
          ]),
        ]).start();

        return;
      }

      // ======================================================
      // ECO REMOVIDO
      // ======================================================

      echoScale.setValue(
        1,
      );

      Animated.sequence([
        Animated.timing(
          echoScale,
          {
            toValue: 0.93,

            duration: 110,

            easing:
              Easing.out(
                Easing.cubic,
              ),

            useNativeDriver:
              true,
          },
        ),

        Animated.timing(
          echoScale,
          {
            toValue: 1,

            duration: 150,

            easing:
              Easing.out(
                Easing.cubic,
              ),

            useNativeDriver:
              true,
          },
        ),
      ]).start();
    },
    [
      usuarioDeuForca,
      echoRotation,
      echoScale,
    ],
  );

  const echoRotate =
    echoRotation.interpolate({
      inputRange: [
        0,
        1,
      ],

      outputRange: [
        "0deg",
        "360deg",
      ],
    });

  return (
    <View
      style={
        styles.card
      }
    >
      {/* ======================================================
          AUTOR DA PUBLICAÇÃO
      ====================================================== */}
      <View
        style={
          styles.postHeader
        }
      >
        {/* ==================================================
            ÁREA CLICÁVEL DO AUTOR
        ================================================== */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Abrir detalhes de ${obterTituloOcorrencia(
            occurrence,
          )}`}
          accessibilityHint="Abre os detalhes completos da ocorrência"
          onPress={() =>
            onPress(
              occurrence.id_ocorrencia,
            )
          }
          style={({
            pressed,
          }) => [
              styles.postHeaderMain,

              pressed &&
              styles.contentPressed,
            ]}
        >
          <View
            style={
              styles.authorAvatar
            }
          >
            {autorFoto ? (
              <Image
                source={{
                  uri: autorFoto,
                }}
                style={
                  styles.authorAvatarImage
                }
              />
            ) : (
              <Text
                style={
                  styles.authorInitials
                }
              >
                {obterIniciais(
                  autorNome,
                )}
              </Text>
            )}
          </View>

          <View
            style={
              styles.authorContent
            }
          >
            <Text
              style={
                styles.authorName
              }
              numberOfLines={1}
            >
              {autorNome}
            </Text>

            <View
              style={
                styles.authorMetaRow
              }
            >
              <View
                style={[
                  styles.statusBadge,

                  {
                    backgroundColor:
                      status.backgroundColor,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,

                    {
                      backgroundColor:
                        status.textColor,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,

                    {
                      color:
                        status.textColor,
                    },
                  ]}
                >
                  {status.label}
                </Text>
              </View>

              {ehUrgente(
                occurrence.nivel_urgencia,
              ) ? (
                <View
                  style={
                    styles.urgentBadge
                  }
                >
                  <Ionicons
                    name="warning-outline"
                    size={11}
                    color={
                      theme.colors
                        .semantic
                        .danger
                        .text
                    }
                  />

                  <Text
                    style={
                      styles.urgentText
                    }
                  >
                    Urgente
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>

        {/* ==================================================
            MENU / DENÚNCIA

            É um botão separado propositalmente para que
            tocar nos três pontos NÃO abra os detalhes.
        ================================================== */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Opções da publicação"
          accessibilityHint="Abre as opções para denunciar esta ocorrência"
          hitSlop={8}
          onPress={() =>
            onOpenOptions(
              occurrence.id_ocorrencia,
            )
          }
          style={({
            pressed,
          }) => [
              styles.moreOptionsButton,

              pressed &&
              styles.buttonPressed,
            ]}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={21}
            color={
              theme.colors
                .textBody
            }
          />
        </Pressable>
      </View>



      {/* ======================================================
          FOTO
      ====================================================== */}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir detalhes de ${obterTituloOcorrencia(
          occurrence,
        )}`}
        accessibilityHint="Abre os detalhes completos da ocorrência"
        onPress={() =>
          onPress(
            occurrence.id_ocorrencia,
          )
        }
        style={({
          pressed,
        }) => [
            styles.imageContainer,

            pressed &&
            styles.imagePressed,
          ]}
      >
        {fotoValida ? (
          <Image
            source={{
              uri:
                occurrence.foto,
            }}
            style={
              styles.image
            }
            resizeMode="cover"
          />
        ) : (
          <View
            style={
              styles.imageFallback
            }
          >
            <MaterialCommunityIcons
              name="paw"
              size={45}
              color={
                theme.colors
                  .brand
              }
            />

            <Text
              style={
                styles.imageFallbackText
              }
            >
              Foto indisponível
            </Text>
          </View>
        )}
      </Pressable>

      {/* ======================================================
          AÇÕES
      ====================================================== */}

      <View
        style={
          styles.actionsRow
        }
      >
        <View
          style={
            styles.actionsLeft
          }
        >
          {/* COMPARTILHAR - AINDA NÃO FUNCIONAL */}

          <Pressable
            disabled
            accessibilityRole="button"
            accessibilityLabel="Compartilhar ocorrência"
            accessibilityState={{
              disabled: true,
            }}
            style={
              styles.actionIconButton
            }
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={
                theme.colors
                  .textBody
              }
            />
          </Pressable>

          {/* ==================================================
              ECOAR - FUNCIONAL
          ================================================== */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              usuarioDeuForca
                ? "Remover Eco da ocorrência"
                : "Ecoar ocorrência"
            }
            accessibilityHint={
              usuarioDeuForca
                ? "Remove seu Eco desta ocorrência"
                : "Ajuda esta ocorrência a alcançar mais pessoas da comunidade"
            }
            accessibilityState={{
              selected:
                usuarioDeuForca,

              disabled:
                forcaLoading,
            }}
            disabled={
              forcaLoading
            }
            onPress={() =>
              onToggleForca(
                occurrence.id_ocorrencia,
              )
            }
            style={({
              pressed,
            }) => [
                styles.forceButton,

                usuarioDeuForca &&
                styles.forceButtonActive,

                forcaLoading &&
                styles.forceButtonLoading,

                pressed &&
                !forcaLoading &&
                styles.forceButtonPressed,
              ]}
          >
            <Animated.Image
              source={require(
                "../../assets/ChatGPT Image 15 de ago. de 2026, 11_30_55.png"
              )}
              resizeMode="contain"
              style={[
                styles.echoIcon,

                {
                  tintColor:
                    usuarioDeuForca
                      ? theme.colors.action
                      : theme.colors.textBody,

                  transform: [
                    {
                      rotate:
                        echoRotate,
                    },

                    {
                      scale:
                        echoScale,
                    },
                  ],
                },
              ]}
            />

            {totalForca > 0 ? (
              <Text
                style={[
                  styles.echoCount,

                  usuarioDeuForca &&
                  styles.echoCountActive,
                ]}
              >
                {totalForca}
              </Text>
            ) : null}
          </Pressable>

          {/* FAVORITO - AINDA NÃO FUNCIONAL */}

          <Pressable
            disabled
            accessibilityRole="button"
            accessibilityLabel="Favoritar ocorrência"
            accessibilityState={{
              disabled: true,
            }}
            style={
              styles.actionIconButton
            }
          >
            <Ionicons
              name="star-outline"
              size={21}
              color={
                theme.colors
                  .textBody
              }
            />
          </Pressable>

          {/* COMENTÁRIOS - AINDA NÃO FUNCIONAL */}

          <Pressable
            disabled
            accessibilityRole="button"
            accessibilityLabel="Abrir comentários"
            accessibilityState={{
              disabled: true,
            }}
            style={
              styles.actionIconButton
            }
          >
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={
                theme.colors
                  .textBody
              }
            />
          </Pressable>
        </View>

        <Text
          style={
            styles.commentsCount
          }
          numberOfLines={1}
        >
          {formatarQuantidadeComentarios(
            occurrence
              .total_comentarios,
          )}
        </Text>
      </View>

      {/* ======================================================
          DESCRIÇÃO
      ====================================================== */}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir detalhes de ${obterTituloOcorrencia(
          occurrence,
        )}`}
        accessibilityHint="Abre os detalhes completos da ocorrência"
        onPress={() =>
          onPress(
            occurrence.id_ocorrencia,
          )
        }
        style={({
          pressed,
        }) => [
            styles.captionContainer,

            pressed &&
            styles.contentPressed,
          ]}
      >
        <Text
          style={
            styles.captionText
          }
          numberOfLines={3}
        >
          {descricao}
        </Text>

        <View
          style={
            styles.postMetaRow
          }
        >
          <View
            style={
              styles.postMetaLeft
            }
          >
            <Text
              style={
                styles.postMetaText
              }
            >
              {formatarTempoRelativo(
                occurrence.data_ocorrencia,
              )}
            </Text>

            <View
              style={
                styles.metaDot
              }
            />

            <Ionicons
              name="location-outline"
              size={13}
              color={
                theme.colors
                  .textBody
              }
            />

            <Text
              style={
                styles.postMetaText
              }
            >
              {formatarDistancia(
                occurrence
                  .distancia_km,
              )}
            </Text>
          </View>

          <View
            style={
              styles.moreButton
            }
          >
            <Text
              style={
                styles.moreText
              }
            >
              Mais
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

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

  const feedModeCarouselRef =
    useRef<ScrollView | null>(
      null,
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
            await api.get<
              OcorrenciaFeed[]
            >(
              "/ocorrencias/proximas",

              {
                params: {
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
                },
              },
            );

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
                styles.buttonPressed,
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
                styles.buttonPressed,
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
                    styles.buttonPressed,
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
                      styles.buttonPressed,
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

            <View
              style={
                styles.feedModeCarouselWrapper
              }
            >
              <ScrollView
                ref={
                  feedModeCarouselRef
                }
                horizontal
                pagingEnabled
                bounces={false}
                scrollEnabled={
                  !refreshing
                }
                showsHorizontalScrollIndicator={
                  false
                }
                keyboardShouldPersistTaps="handled"
                decelerationRate="fast"
              >
                {/* =============================================
                    PÁGINA 1 — LAYOUT ORIGINAL / PROXIMIDADE
                ============================================== */}

                <View
                  style={
                    styles.feedModeCarouselPage
                  }
                >
                  {/* ===========================================
                      BUSCA
                  ============================================ */}

                  <View
                    style={
                      styles.searchBox
                    }
                  >
                    <Ionicons
                      name="search-outline"
                      size={19}
                      color={
                        theme.colors
                          .textBody
                      }
                    />

                    <TextInput
                      value={
                        search
                      }
                      onChangeText={
                        setSearch
                      }
                      placeholder="Pesquisar animal ou local..."
                      placeholderTextColor={
                        theme.colors
                          .textBody
                      }
                      style={
                        styles.searchInput
                      }
                      returnKeyType="search"
                    />

                    {search.length >
                    0 ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Limpar pesquisa"
                        hitSlop={8}
                        onPress={() =>
                          setSearch(
                            "",
                          )
                        }
                      >
                        <Ionicons
                          name="close-circle"
                          size={19}
                          color={
                            theme.colors
                              .textBody
                          }
                        />
                      </Pressable>
                    ) : null}
                  </View>

                  {/* ===========================================
                      CABEÇALHO ORIGINAL DO FEED
                  ============================================ */}

                  <View
                    style={
                      styles.feedSectionHeader
                    }
                  >
                    <View
                      style={
                        styles.feedSectionText
                      }
                    >
                      <Text
                        style={
                          styles.feedSectionTitle
                        }
                      >
                        Ocorrências
                      </Text>

                      <Text
                        style={
                          styles.feedSectionSubtitle
                        }
                      >
                        Ordenadas da mais próxima para a mais distante
                      </Text>
                    </View>

                    <View
                      style={
                        styles.counterBadge
                      }
                    >
                      <Text
                        style={
                          styles.counterText
                        }
                      >
                        {
                          ocorrenciasFiltradas
                            .length
                        }
                      </Text>
                    </View>
                  </View>
                </View>

                {/* =============================================
                    PÁGINA 2 — SELEÇÃO DE MODO
                ============================================== */}

                <View
                  style={[
                    styles.feedModeCarouselPage,
                    styles.feedModeButtonsPage,
                  ]}
                >
                  {/* ===========================================
                      MODO PROXIMIDADE
                  ============================================ */}

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Ocorrências locais"
                    accessibilityHint={`Mostra ocorrências dentro do raio de ${raioPesquisaKm} km`}
                    accessibilityState={{
                      selected:
                        modoFeed ===
                        "PROXIMIDADE",

                      disabled:
                        refreshing,
                    }}
                    disabled={
                      refreshing
                    }
                    onPress={() => {
                      selecionarModoFeed(
                        "PROXIMIDADE",
                      );
                    }}
                    style={({
                      pressed,
                    }) => [
                        styles.feedModeButton,

                        modoFeed ===
                          "PROXIMIDADE" &&
                          styles.feedModeButtonActive,

                        pressed &&
                          !refreshing &&
                          styles.feedModeButtonPressed,
                      ]}
                  >
                    <View
                      style={[
                        styles.feedModeIconBox,

                        modoFeed ===
                          "PROXIMIDADE" &&
                          styles.feedModeIconBoxActive,
                      ]}
                    >
                      <Ionicons
                        name="location-outline"
                        size={24}
                        color={
                          modoFeed ===
                            "PROXIMIDADE"
                            ? theme.colors
                              .surface
                            : theme.colors
                              .brand
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.feedModeContent
                      }
                    >
                      <Text
                        style={[
                          styles.feedModeTitle,

                          modoFeed ===
                            "PROXIMIDADE" &&
                            styles.feedModeTitleActive,
                        ]}
                        numberOfLines={1}
                      >
                        Ocorrências locais
                      </Text>

                      <Text
                        style={[
                          styles.feedModeSubtitle,

                          modoFeed ===
                            "PROXIMIDADE" &&
                            styles.feedModeSubtitleActive,
                        ]}
                        numberOfLines={1}
                      >
                        Até {raioPesquisaKm} km
                      </Text>
                    </View>
                  </Pressable>

                  {/* ===============================================
                      MODO ECO
                  ================================================ */}

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Ocorrências mais ecoadas"
                    accessibilityHint="Mostra ocorrências globais priorizando as que receberam mais Ecos"
                    accessibilityState={{
                      selected:
                        modoFeed ===
                        "ECO",

                      disabled:
                        refreshing,
                    }}
                    disabled={
                      refreshing
                    }
onPress={() => {
                      selecionarModoFeed(
                        "ECO",
                      );
                    }}
                    style={({
                      pressed,
                    }) => [
                        styles.feedModeButton,

                        modoFeed ===
                          "ECO" &&
                          styles.feedModeButtonActive,

                        pressed &&
                          !refreshing &&
                          styles.feedModeButtonPressed,
                      ]}
                  >
                    <View
                      style={[
                        styles.feedModeIconBox,

                        modoFeed ===
                          "ECO" &&
                          styles.feedModeIconBoxActive,
                      ]}
                    >
                      <Image
                        source={require(
                          "../../assets/ChatGPT Image 15 de ago. de 2026, 11_30_55.png"
                        )}
                        resizeMode="contain"
                        style={[
                          styles.feedModeEcoIcon,

                          {
                            tintColor:
                              modoFeed ===
                                "ECO"
                                ? theme.colors
                                  .surface
                                : theme.colors
                                  .brand,
                          },
                        ]}
                      />
                    </View>

                    <View
                      style={
                        styles.feedModeContent
                      }
                    >
                      <Text
                        style={[
                          styles.feedModeTitle,

                          modoFeed ===
                          "ECO" &&
                          styles.feedModeTitleActive,
                        ]}
                        numberOfLines={1}
                      >
                        ECO
                      </Text>

                      <Text
                        style={[
                          styles.feedModeSubtitle,

                          modoFeed ===
                          "ECO" &&
                          styles.feedModeSubtitleActive,
                        ]}
                        numberOfLines={1}
                      >
                        Mais ecoadas
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </ScrollView>
            </View>

            {/* =================================================
                FILTROS
            ================================================= */}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.filtersContent
              }
            >
              {FILTROS.map(
                (
                  item,
                ) => {
                  const ativo =
                    filtro ===
                    item.id;

                  return (
                    <Pressable
                      key={
                        item.id
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Filtrar por ${item.label}`}
                      onPress={() =>
                        setFiltro(
                          item.id,
                        )
                      }
                      style={({
                        pressed,
                      }) => [
                          styles.filterChip,

                          ativo &&
                          styles.filterChipActive,

                          pressed &&
                          styles.buttonPressed,
                        ]}
                    >
                      <Ionicons
                        name={
                          item.icon
                        }
                        size={15}
                        color={
                          ativo
                            ? theme
                              .colors
                              .surface
                            : theme
                              .colors
                              .brand
                        }
                      />

                      <Text
                        style={[
                          styles.filterText,

                          ativo &&
                          styles.filterTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </ScrollView>
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
                      styles.buttonPressed,
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
              StyleSheet.absoluteFill
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
                    styles.buttonPressed,
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
                  styles.buttonPressed,
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

// ============================================================
// ESTILOS
// ============================================================

const styles =
  StyleSheet.create({
    // ========================================================
    // BASE
    // ========================================================

    container: {
      flex: 1,

      backgroundColor:
        theme.colors
          .background,
    },

    listContent: {
      paddingHorizontal:
        theme.spacing
          .globalMargin,

      paddingBottom:
        125,
    },

    // ========================================================
    // HEADER
    // ========================================================

    header: {
      minHeight: 82,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingVertical:
        10,

      gap: 12,
    },

    headerMenuButton: {
      width: 46,
      height: 46,

      borderRadius:
        23,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        theme.colors
          .surface,

      ...theme.shadows
        .elevation1,
    },

    headerContent: {
      flex: 1,

      justifyContent:
        "center",

      minWidth: 0,
    },

    headerTitle: {
      color:
        theme.colors
          .textTitle,

      fontSize: 20,

      fontWeight:
        "900",

      letterSpacing:
        -0.3,

      textAlign:
        "center",
    },

    headerActions: {
      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 5,
    },

    headerAvatarButton: {
      width: 46,
      height: 46,

      borderRadius:
        23,

      padding: 2,

      backgroundColor:
        theme.colors
          .surface,

      ...theme.shadows
        .elevation1,
    },

    headerAvatarImage: {
      width: "100%",
      height: "100%",

      borderRadius:
        21,
    },

    headerOnlineIndicator: {
      position:
        "absolute",

      right: 1,
      bottom: 1,

      width: 11,
      height: 11,

      borderRadius:
        6,

      backgroundColor:
        theme.colors
          .semantic
          .success
          .text,

      borderWidth:
        2,

      borderColor:
        theme.colors
          .surface,
    },

    radiusBadge: {
      minHeight: 25,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 3,

      paddingHorizontal:
        8,

      borderRadius:
        theme.radius
          .button,

      backgroundColor:
        theme.colors
          .semantic
          .success
          .bg,
    },

    radiusText: {
      color:
        theme.colors
          .brand,

      fontSize: 10,

      fontWeight:
        "800",
    },

    // ========================================================
    // CARROSSEL: BUSCA / MODOS DO FEED
    // ========================================================

    feedModeCarouselWrapper: {
      width: "100%",

      overflow:
        "hidden",
    },

    feedModeCarouselPage: {
      width:
        FEED_MODE_CAROUSEL_WIDTH,
    },

    // ========================================================
    // BUSCA
    // ========================================================

    searchBox: {
      width: "100%",
      minHeight: 48,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        14,

      borderRadius:
        15,

      backgroundColor:
        theme.colors
          .surface,

      ...theme.shadows
        .elevation1,
    },

    searchInput: {
      flex: 1,

      height: 48,

      marginLeft: 9,

      color:
        theme.colors
          .textTitle,

      fontSize: 13,
    },

    // ========================================================
    // CABEÇALHO ORIGINAL DO FEED
    // ========================================================

    feedSectionHeader: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginTop: 22,

      marginBottom:
        12,
    },

    feedSectionText: {
      flex: 1,

      paddingRight: 12,
    },

    feedSectionTitle: {
      color:
        theme.colors
          .textTitle,

      fontSize: 16,

      fontWeight:
        "900",
    },

    feedSectionSubtitle: {
      marginTop: 3,

      color:
        theme.colors
          .textBody,

      fontSize: 10,
    },

    counterBadge: {
      minWidth: 34,
      height: 30,

      paddingHorizontal:
        9,

      borderRadius:
        theme.radius
          .button,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        theme.colors
          .inputBg,
    },

    counterText: {
      color:
        theme.colors
          .brand,

      fontSize: 11,

      fontWeight:
        "900",
    },

    // ========================================================
    // PÁGINA DOS MODOS
    // ========================================================

    feedModeButtonsPage: {
      minHeight: 112,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 10,

      paddingBottom: 12,
    },

    feedModeButton: {
      flex: 1,

      minWidth: 0,
      minHeight: 88,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal: 12,

      borderWidth: 1,

      borderColor:
        theme.colors
          .inputBg,

      borderRadius: 18,

      backgroundColor:
        theme.colors
          .surface,

      ...theme.shadows
        .elevation1,
    },

    feedModeButtonActive: {
      borderColor:
        theme.colors
          .brand,

      backgroundColor:
        theme.colors
          .brand,
    },

    feedModeButtonPressed: {
      opacity: 0.82,

      transform: [
        {
          scale: 0.985,
        },
      ],
    },

    feedModeIconBox: {
      width: 42,
      height: 42,

      flexShrink: 0,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius: 14,

      backgroundColor:
        theme.colors
          .semantic
          .success
          .bg,
    },

    feedModeIconBoxActive: {
      backgroundColor:
        theme.colors
          .action,
    },

    feedModeEcoIcon: {
      width: 26,
      height: 26,
    },

    feedModeContent: {
      flex: 1,

      minWidth: 0,

      marginLeft: 10,
    },

    feedModeTitle: {
      color:
        theme.colors
          .textTitle,

      fontSize: 12,

      fontWeight:
        "900",
    },

    feedModeTitleActive: {
      color:
        theme.colors
          .surface,
    },

    feedModeSubtitle: {
      marginTop: 4,

      color:
        theme.colors
          .textBody,

      fontSize: 9,

      fontWeight:
        "600",
    },

    feedModeSubtitleActive: {
      color:
        theme.colors
          .surface,
    },

    // ========================================================
    // FILTROS
    // ========================================================

    filtersContent: {
      gap: 8,

      paddingBottom:
        14,

      paddingRight:
        6,
    },

    filterChip: {
      minHeight: 38,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 6,

      paddingHorizontal:
        13,

      borderRadius:
        theme.radius
          .button,

      borderWidth:
        1,

      borderColor:
        theme.colors
          .inputBg,

      backgroundColor:
        theme.colors
          .surface,
    },

    filterChipActive: {
      borderColor:
        theme.colors
          .brand,

      backgroundColor:
        theme.colors
          .brand,
    },

    filterText: {
      color:
        theme.colors
          .textBody,

      fontSize: 11,

      fontWeight:
        "700",
    },

    filterTextActive: {
      color:
        theme.colors
          .surface,
    },

    // ========================================================
    // CARD / PUBLICAÇÃO
    // ========================================================

    card: {
      overflow:
        "hidden",

      marginBottom:
        18,

      borderRadius:
        theme.radius
          .card,

      borderWidth:
        1,

      borderColor:
        theme.colors
          .inputBg,

      backgroundColor:
        theme.colors
          .surface,

      ...theme.shadows
        .elevation1,
    },

    // ========================================================
    // AUTOR
    // ========================================================

    postHeader: {
      minHeight: 70,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        13,

      paddingVertical:
        11,
    },

    postHeaderMain: {
      flex: 1,

      minWidth: 0,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    contentPressed: {
      opacity: 0.84,
    },


    authorAvatar: {
      width: 44,
      height: 44,

      borderRadius:
        22,

      overflow:
        "hidden",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        theme.colors
          .brand,
    },

    authorAvatarImage: {
      width: "100%",
      height: "100%",
    },

    authorInitials: {
      color:
        theme.colors
          .surface,

      fontSize: 13,

      fontWeight:
        "900",
    },

    authorContent: {
      flex: 1,

      minWidth: 0,

      marginLeft:
        11,
    },

    authorName: {
      color:
        theme.colors
          .textTitle,

      fontSize: 13,

      fontWeight:
        "900",
    },

    authorMetaRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      flexWrap:
        "wrap",

      gap: 6,

      marginTop: 5,
    },

    statusBadge: {
      minHeight: 22,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 5,

      paddingHorizontal:
        8,

      borderRadius:
        theme.radius
          .button,
    },

    statusDot: {
      width: 6,
      height: 6,

      borderRadius:
        3,
    },

    statusText: {
      fontSize: 9,

      fontWeight:
        "900",
    },

    urgentBadge: {
      minHeight: 22,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 4,

      paddingHorizontal:
        7,

      borderRadius:
        theme.radius
          .button,

      backgroundColor:
        theme.colors
          .semantic
          .danger
          .bg,
    },

    urgentText: {
      color:
        theme.colors
          .semantic
          .danger
          .text,

      fontSize: 9,

      fontWeight:
        "800",
    },

    moreOptionsButton: {
      width: 38,
      height: 38,

      marginLeft: 6,

      borderRadius:
        19,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    // ========================================================
    // FOTO
    // ========================================================

    imageContainer: {
      height: 215,

      backgroundColor:
        theme.colors
          .inputBg,
    },

    imagePressed: {
      opacity:
        0.94,
    },

    image: {
      width: "100%",
      height: "100%",
    },

    imageFallback: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 8,

      backgroundColor:
        theme.colors
          .inputBg,
    },

    imageFallbackText: {
      color:
        theme.colors
          .textBody,

      fontSize: 11,

      fontWeight:
        "600",
    },

    // ========================================================
    // AÇÕES
    // ========================================================

    actionsRow: {
      minHeight: 56,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      gap: 8,

      paddingHorizontal:
        11,

      borderBottomWidth:
        1,

      borderBottomColor:
        theme.colors
          .inputBg,
    },

    actionsLeft: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 3,
    },

    actionIconButton: {
      width: 34,
      height: 36,

      borderRadius:
        18,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    forceButton: {
      minWidth: 68,
      minHeight: 44,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 6,

      paddingHorizontal:
        11,

      borderRadius:
        22,

      backgroundColor:
        "transparent",
    },

    forceButtonActive: {
      backgroundColor:
        theme.colors
          .semantic
          .success
          .bg,
    },

    forceButtonLoading: {
      opacity: 0.52,
    },

    forceButtonPressed: {
      transform: [
        {
          scale: 0.96,
        },
      ],
    },

    echoIcon: {
      width: 29,
      height: 29,
    },

    echoCount: {
      minWidth: 13,

      color:
        theme.colors
          .textBody,

      fontSize: 11,

      fontWeight:
        "800",

      textAlign:
        "center",
    },

    echoCountActive: {
      color:
        theme.colors
          .action,
    },

    commentsCount: {
      flexShrink: 1,

      color:
        theme.colors
          .textBody,

      fontSize: 9,

      fontWeight:
        "600",

      textAlign:
        "right",
    },

    // ========================================================
    // DESCRIÇÃO
    // ========================================================

    captionContainer: {
      paddingHorizontal:
        13,

      paddingTop: 11,

      paddingBottom:
        12,
    },

    captionText: {
      color:
        theme.colors
          .textTitle,

      fontSize: 12,

      lineHeight: 18,

      fontWeight:
        "500",
    },

    postMetaRow: {
      minHeight: 30,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      gap: 12,

      marginTop: 7,
    },

    postMetaLeft: {
      flex: 1,

      flexDirection:
        "row",

      alignItems:
        "center",

      minWidth: 0,

      gap: 4,
    },

    postMetaText: {
      color:
        theme.colors
          .textBody,

      fontSize: 9,

      fontWeight:
        "600",
    },

    metaDot: {
      width: 3,
      height: 3,

      marginHorizontal:
        2,

      borderRadius:
        2,

      backgroundColor:
        theme.colors
          .textBody,
    },

    moreButton: {
      minHeight: 30,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        5,
    },

    moreText: {
      color:
        theme.colors
          .brand,

      fontSize: 11,

      fontWeight:
        "900",
    },

    // ========================================================
    // DENÚNCIA
    // ========================================================

    reportOverlay: {
      flex: 1,

      justifyContent:
        "flex-end",

      backgroundColor:
        "rgba(0, 0, 0, 0.38)",
    },

    reportSheet: {
      paddingHorizontal:
        theme.spacing
          .globalMargin,

      paddingTop: 10,

      paddingBottom:
        26,

      borderTopLeftRadius:
        24,

      borderTopRightRadius:
        24,

      backgroundColor:
        theme.colors
          .surface,

      ...theme.shadows
        .elevation1,
    },

    reportHandle: {
      width: 38,
      height: 4,

      alignSelf:
        "center",

      marginBottom:
        15,

      borderRadius:
        2,

      backgroundColor:
        theme.colors
          .inputBg,
    },

    reportHeader: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginBottom:
        17,
    },

    reportHeaderIcon: {
      width: 42,
      height: 42,

      borderRadius:
        14,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        theme.colors
          .semantic
          .danger
          .bg,
    },

    reportHeaderContent: {
      flex: 1,

      minWidth: 0,

      marginLeft:
        11,
    },

    reportTitle: {
      color:
        theme.colors
          .textTitle,

      fontSize: 16,

      fontWeight:
        "900",
    },

    reportDescription: {
      marginTop: 3,

      color:
        theme.colors
          .textBody,

      fontSize: 11,

      lineHeight: 16,
    },

    reportCloseButton: {
      width: 38,
      height: 38,

      marginLeft: 8,

      borderRadius:
        19,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    reportReasons: {
      gap: 8,
    },

    reportReasonButton: {
      minHeight: 54,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        11,

      borderRadius:
        15,

      backgroundColor:
        theme.colors
          .background,
    },

    reportReasonButtonPressed: {
      opacity: 0.72,
    },

    reportReasonIcon: {
      width: 34,
      height: 34,

      borderRadius:
        11,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        theme.colors
          .surface,
    },

    reportReasonText: {
      flex: 1,

      marginHorizontal:
        10,

      color:
        theme.colors
          .textTitle,

      fontSize: 12,

      lineHeight: 17,

      fontWeight:
        "700",
    },

    reportLoading: {
      minHeight: 130,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 9,
    },

    reportLoadingText: {
      color:
        theme.colors
          .textBody,

      fontSize: 12,

      fontWeight:
        "600",
    },

    reportCancelButton: {
      minHeight: 46,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginTop: 12,

      borderRadius:
        theme.radius
          .button,

      backgroundColor:
        theme.colors
          .inputBg,
    },

    reportCancelText: {
      color:
        theme.colors
          .textBody,

      fontSize: 12,

      fontWeight:
        "800",
    },



    // ========================================================
    // EMPTY
    // ========================================================

    emptyContainer: {
      alignItems:
        "center",

      paddingHorizontal:
        25,

      paddingVertical:
        60,
    },

    emptyIcon: {
      width: 72,
      height: 72,

      borderRadius:
        36,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        theme.colors
          .semantic
          .success
          .bg,
    },

    emptyTitle: {
      marginTop: 17,

      color:
        theme.colors
          .textTitle,

      fontSize: 16,

      fontWeight:
        "900",

      textAlign:
        "center",
    },

    emptyText: {
      maxWidth: 290,

      marginTop: 7,

      color:
        theme.colors
          .textBody,

      fontSize: 12,

      lineHeight: 18,

      textAlign:
        "center",
    },

    clearButton: {
      minHeight: 40,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginTop: 18,

      paddingHorizontal:
        17,

      borderRadius:
        theme.radius
          .button,

      backgroundColor:
        theme.colors
          .inputBg,
    },

    clearButtonText: {
      color:
        theme.colors
          .brand,

      fontSize: 11,

      fontWeight:
        "800",
    },

    // ========================================================
    // REGISTRAR OCORRÊNCIA
    // ========================================================

    registerButton: {
      position:
        "absolute",

      left:
        theme.spacing
          .globalMargin,

      right:
        theme.spacing
          .globalMargin,

      bottom: 18,

      minHeight: 66,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        12,

      borderRadius:
        21,

      backgroundColor:
        theme.colors
          .brand,

      ...theme.shadows
        .buttonGlow,
    },

    registerButtonPressed: {
      transform: [
        {
          scale:
            0.985,
        },
      ],

      opacity:
        0.96,
    },

    registerButtonIcon: {
      width: 43,
      height: 43,

      borderRadius:
        14,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        theme.colors
          .surface,
    },

    registerButtonContent: {
      flex: 1,

      marginLeft:
        11,
    },

    registerButtonTitle: {
      color:
        theme.colors
          .surface,

      fontSize: 13,

      fontWeight:
        "900",
    },

    registerButtonSubtitle: {
      marginTop: 2,

      color:
        theme.colors
          .surface,

      fontSize: 9,

      fontWeight:
        "500",
    },

    registerButtonArrow: {
      width: 38,
      height: 38,

      borderRadius:
        12,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        theme.colors
          .action,
    },

    // ========================================================
    // LOADING / ERRO / LOCALIZAÇÃO
    // ========================================================

    stateContainer: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        30,
    },

    stateIcon: {
      width: 76,
      height: 76,

      borderRadius:
        38,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom:
        16,

      backgroundColor:
        theme.colors
          .semantic
          .success
          .bg,
    },

    errorIcon: {
      backgroundColor:
        theme.colors
          .semantic
          .danger
          .bg,
    },

    stateTitle: {
      marginTop: 14,

      color:
        theme.colors
          .textTitle,

      fontSize: 18,

      fontWeight:
        "900",

      textAlign:
        "center",
    },

    stateDescription: {
      maxWidth: 300,

      marginTop: 8,

      color:
        theme.colors
          .textBody,

      fontSize: 12,

      lineHeight: 19,

      textAlign:
        "center",
    },

    stateButton: {
      minHeight: 48,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 7,

      marginTop: 22,

      paddingHorizontal:
        20,

      borderRadius:
        theme.radius
          .button,

      backgroundColor:
        theme.colors
          .brand,

      ...theme.shadows
        .buttonGlow,
    },

    stateButtonText: {
      color:
        theme.colors
          .surface,

      fontSize: 12,

      fontWeight:
        "800",
    },

    buttonPressed: {
      opacity:
        0.78,
    },
  });