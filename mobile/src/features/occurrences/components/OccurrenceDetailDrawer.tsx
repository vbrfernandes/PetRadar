import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import api from "../../../services/api";
import { useAuthStore } from "../../../store/useAuthStore";
import { theme } from "../../../theme/colors";

import { occurrenceService } from "../services/occurrenceService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 430);

interface OccurrenceDetailDrawerProps {
  visible: boolean;
  occurrenceId: number | null;
  onClose: () => void;
  onEdit: (occurrenceId: number) => void;
  onDeleted: (occurrenceId: number) => void | Promise<void>;
}

type TipoCuidado = "AGUA" | "COMIDA";

interface AutorCuidado {
  id_conta: number;
  nome: string;
}

interface CuidadoOcorrencia {
  id_historico: number;
  tipo_cuidado: TipoCuidado;
  data_cuidado: string;
  data_registro: string;
  usuario: AutorCuidado;
}

interface EstadoCuidados {
  agua: CuidadoOcorrencia | null;
  comida: CuidadoOcorrencia | null;
}

interface OcorrenciaDetalhe {
  id_ocorrencia: number;
  id_conta: number;

  tipo_ocorrencia: string;
  status_badge: string;
  tipo_animal: string;

  raca: string | null;
  sexo: string | null;
  cor: string | null;
  porte: string | null;
  idade: string | null;

  saude_critica: boolean;
  saude_detalhes: string | null;

  cuidados_iniciais: string | null;
  cuidados_atuais: EstadoCuidados;

  deficiencia: boolean;
  deficiencia_detalhes: string | null;

  nivel_urgencia: string;

  data_ocorrencia: string;
  endereco_localizacao: string | null;

  foto: string;
  observacao: string | null;
}

const COLORS = {
  primary: theme.colors.brand,
  action: theme.colors.action,
  background: theme.colors.background,
  surface: theme.colors.surface,
  textTitle: theme.colors.textTitle,
  textBody: theme.colors.textBody,
  border: theme.colors.inputBg,

  danger: theme.colors.semantic.danger.text,
  dangerBg: theme.colors.semantic.danger.bg,

  warning: theme.colors.semantic.warning.text,
  warningBg: theme.colors.semantic.warning.bg,

  success: theme.colors.semantic.success.text,
  successBg: theme.colors.semantic.success.bg,

  white: "#FFFFFF",
  muted: "#94A3B8",
  overlay: "rgba(15, 23, 42, 0.56)",
  imageOverlay: "rgba(15, 23, 42, 0.24)",
};

function normalizarTexto(
  valor: string | null | undefined
): string | null {
  if (!valor) {
    return null;
  }

  const texto = String(valor).trim();

  return texto.length > 0 ? texto : null;
}

function formatarData(data: string) {
  if (!data) {
    return "Data não informada";
  }

  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return data;
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatarDataHora(data: string) {
  if (!data) {
    return "Data não informada";
  }

  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return data;
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatarDataHoraParaApi(date = new Date()) {
  const doisDigitos = (valor: number) =>
    String(valor).padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${doisDigitos(date.getMonth() + 1)}-` +
    `${doisDigitos(date.getDate())}T` +
    `${doisDigitos(date.getHours())}:` +
    `${doisDigitos(date.getMinutes())}:` +
    `${doisDigitos(date.getSeconds())}`
  );
}

function mensagemErroApi(
  error: unknown,
  mensagemPadrao: string
) {
  if (
    axios.isAxiosError<{
      detail?: string;
    }>(error)
  ) {
    return error.response?.data?.detail || mensagemPadrao;
  }

  return mensagemPadrao;
}

function getStatusColors(status: string) {
  const normalized = status?.toUpperCase() || "";

  if (normalized === "PERDIDO") {
    return {
      text: COLORS.danger,
      background: COLORS.dangerBg,
    };
  }

  if (normalized === "AVISTADO") {
    return {
      text: COLORS.warning,
      background: COLORS.warningBg,
    };
  }

  return {
    text: COLORS.success,
    background: COLORS.successBg,
  };
}

function getUrgencyColors(urgencia: string) {
  const normalized = urgencia?.toUpperCase() || "";

  if (
    normalized.includes("CRÍT") ||
    normalized.includes("CRIT")
  ) {
    return {
      text: COLORS.danger,
      background: COLORS.dangerBg,
    };
  }

  if (
    normalized.includes("ALTA") ||
    normalized.includes("ALTO")
  ) {
    return {
      text: COLORS.warning,
      background: COLORS.warningBg,
    };
  }

  return {
    text: COLORS.success,
    background: COLORS.successBg,
  };
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

function SectionHeader({
  title,
  subtitle,
  action,
}: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderContent}>
        <Text style={styles.sectionTitle}>{title}</Text>

        {subtitle ? (
          <Text style={styles.sectionSubtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {action}
    </View>
  );
}

interface DetailItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | null | undefined;
}

interface DetailsCardProps {
  items: DetailItem[];
}

function DetailsCard({ items }: DetailsCardProps) {
  const itensValidos = items
    .map((item) => ({
      ...item,
      valueNormalized: normalizarTexto(item.value),
    }))
    .filter(
      (
        item
      ): item is DetailItem & {
        valueNormalized: string;
      } => item.valueNormalized !== null
    );

  if (itensValidos.length === 0) {
    return null;
  }

  return (
    <View style={styles.detailsCard}>
      {itensValidos.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons
                name={item.icon}
                size={19}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                {item.label}
              </Text>

              <Text
                style={styles.detailValue}
                numberOfLines={3}
              >
                {item.valueNormalized}
              </Text>
            </View>
          </View>

          {index < itensValidos.length - 1 ? (
            <View style={styles.detailDivider} />
          ) : null}
        </React.Fragment>
      ))}
    </View>
  );
}

interface CareButtonProps {
  tipo: TipoCuidado;
  disabled: boolean;
  loading: boolean;
  onPress: (tipo: TipoCuidado) => void;
}

function CareButton({
  tipo,
  disabled,
  loading,
  onPress,
}: CareButtonProps) {
  const agua = tipo === "AGUA";
  const label = agua ? "Água" : "Comida";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Registrar ${label.toLowerCase()} agora`}
      accessibilityHint="Registra o cuidado usando a data e hora atuais"
      disabled={disabled}
      onPress={() => onPress(tipo)}
      style={({ pressed }) => [
        styles.careButton,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.careButtonIcon}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
          />
        ) : (
          <MaterialCommunityIcons
            name={agua ? "water" : "food"}
            size={26}
            color={COLORS.primary}
          />
        )}
      </View>

      <Text style={styles.careButtonTitle}>
        {label}
      </Text>

      <Text style={styles.careButtonSubtitle}>
        {loading ? "Registrando..." : "Registrar agora"}
      </Text>
    </Pressable>
  );
}

interface CareInfoProps {
  tipo: TipoCuidado;
  cuidado: CuidadoOcorrencia | null;
}

function CareInfo({
  tipo,
  cuidado,
}: CareInfoProps) {
  const agua = tipo === "AGUA";

  return (
    <View style={styles.careInfo}>
      <View style={styles.careInfoIcon}>
        <MaterialCommunityIcons
          name={agua ? "water" : "food"}
          size={20}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.careInfoContent}>
        <Text style={styles.careInfoLabel}>
          {agua ? "Última água" : "Última comida"}
        </Text>

        <Text style={styles.careInfoDate}>
          {cuidado
            ? formatarDataHora(cuidado.data_cuidado)
            : "Não registrada"}
        </Text>

        {cuidado ? (
          <View style={styles.authorRow}>
            <Ionicons
              name="person-outline"
              size={13}
              color={COLORS.textBody}
            />

            <Text
              style={styles.careInfoAuthor}
              numberOfLines={1}
            >
              {cuidado.usuario.nome}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default function OccurrenceDetailDrawer({
  visible,
  occurrenceId,
  onClose,
  onEdit,
  onDeleted,
}: OccurrenceDetailDrawerProps) {
  const translateX = useRef(
    new Animated.Value(DRAWER_WIDTH)
  ).current;

  const overlayOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const cuidadoEmRegistro = useRef(false);
  const exclusaoEmAndamento = useRef(false);

  const user = useAuthStore((state) => state.user);

  const [mounted, setMounted] = useState(false);
  const [occurrence, setOccurrence] =
    useState<OcorrenciaDetalhe | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const [
    tipoCuidadoCarregando,
    setTipoCuidadoCarregando,
  ] = useState<TipoCuidado | null>(null);

  const [erroCuidado, setErroCuidado] =
    useState<string | null>(null);

  const [historicoVisivel, setHistoricoVisivel] =
    useState(false);

  const [historico, setHistorico] =
    useState<CuidadoOcorrencia[] | null>(null);

  const [
    carregandoHistorico,
    setCarregandoHistorico,
  ] = useState(false);

  const [erroHistorico, setErroHistorico] =
    useState<string | null>(null);

  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    if (!visible || occurrenceId === null) {
      return;
    }

    let ativo = true;

    setMounted(true);
    setLoading(true);
    setError(null);
    setOccurrence(null);
    setErroCuidado(null);
    setHistoricoVisivel(false);
    setHistorico(null);
    setErroHistorico(null);
    setTipoCuidadoCarregando(null);
    setExcluindo(false);

    cuidadoEmRegistro.current = false;
    exclusaoEmAndamento.current = false;

    translateX.setValue(DRAWER_WIDTH);
    overlayOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    const carregarDetalhes = async () => {
      try {
        const response = await occurrenceService.getById<OcorrenciaDetalhe>(
          occurrenceId
        );

        if (ativo) {
          setOccurrence(response.data);
        }
      } catch (err: unknown) {
        console.warn(
          "[OccurrenceDetailDrawer] Erro ao carregar ocorrência:",
          err
        );

        if (ativo) {
          setError(
            mensagemErroApi(
              err,
              "Não foi possível carregar os detalhes da ocorrência."
            )
          );
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    };

    void carregarDetalhes();

    return () => {
      ativo = false;
    };
  }, [
    visible,
    occurrenceId,
    translateX,
    overlayOpacity,
  ]);

  const limparEstado = () => {
    cuidadoEmRegistro.current = false;
    exclusaoEmAndamento.current = false;

    setMounted(false);
    setOccurrence(null);
    setError(null);
    setLoading(false);

    setTipoCuidadoCarregando(null);
    setErroCuidado(null);

    setHistoricoVisivel(false);
    setHistorico(null);
    setCarregandoHistorico(false);
    setErroHistorico(null);
    setExcluindo(false);
  };

  const animarFechamento = (aposFechar?: () => void) => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 230,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      limparEstado();
      onClose();
      aposFechar?.();
    });
  };

  const fechar = () => {
    animarFechamento();
  };

  const registrarCuidadoAgora = async (
    tipo: TipoCuidado
  ) => {
    if (!occurrence || cuidadoEmRegistro.current) {
      return;
    }

    cuidadoEmRegistro.current = true;

    try {
      setTipoCuidadoCarregando(tipo);
      setErroCuidado(null);

      const response = await api.post<CuidadoOcorrencia>(
        `/ocorrencias/${occurrence.id_ocorrencia}/cuidados`,
        {
          tipo_cuidado: tipo,
          data_cuidado: formatarDataHoraParaApi(),
        }
      );

      const novoCuidado = response.data;
      const chave =
        tipo === "AGUA" ? "agua" : "comida";

      setOccurrence((atual) => {
        if (!atual) {
          return atual;
        }

        return {
          ...atual,
          cuidados_atuais: {
            ...atual.cuidados_atuais,
            [chave]: novoCuidado,
          },
        };
      });

      setHistorico((atual) =>
        atual ? [novoCuidado, ...atual] : atual
      );
    } catch (err: unknown) {
      const cuidado =
        tipo === "AGUA" ? "a água" : "a comida";

      setErroCuidado(
        mensagemErroApi(
          err,
          `Não foi possível registrar ${cuidado}.`
        )
      );
    } finally {
      cuidadoEmRegistro.current = false;
      setTipoCuidadoCarregando(null);
    }
  };

  const carregarHistorico = async () => {
    if (
      !occurrence ||
      carregandoHistorico
    ) {
      return;
    }

    try {
      setCarregandoHistorico(true);
      setErroHistorico(null);

      const response = await api.get<
        CuidadoOcorrencia[]
      >(
        `/ocorrencias/${occurrence.id_ocorrencia}/cuidados/historico`
      );

      setHistorico(response.data);
    } catch (err: unknown) {
      setErroHistorico(
        mensagemErroApi(
          err,
          "Não foi possível carregar o histórico."
        )
      );
    } finally {
      setCarregandoHistorico(false);
    }
  };

  const abrirHistorico = () => {
    setHistoricoVisivel(true);

    if (historico === null) {
      void carregarHistorico();
    }
  };

  const editarOcorrencia = () => {
    if (!occurrence) {
      return;
    }

    const id = occurrence.id_ocorrencia;
    animarFechamento(() => onEdit(id));
  };

  const excluirOcorrencia = async () => {
    if (!occurrence || exclusaoEmAndamento.current) {
      return;
    }

    exclusaoEmAndamento.current = true;
    setExcluindo(true);

    const id = occurrence.id_ocorrencia;

    try {
      await api.delete(`/ocorrencias/${id}`);

      animarFechamento(() => {
        void (async () => {
          try {
            await onDeleted(id);
          } catch (err: unknown) {
            console.warn(
              "[OccurrenceDetailDrawer] Erro ao atualizar ocorrências após exclusão:",
              err,
            );
          } finally {
            Alert.alert(
              "Ocorrência excluída",
              "A ocorrência foi removida com sucesso.",
            );
          }
        })();
      });
    } catch (err: unknown) {
      exclusaoEmAndamento.current = false;
      setExcluindo(false);
      Alert.alert(
        "Não foi possível excluir",
        mensagemErroApi(
          err,
          "Não foi possível excluir a ocorrência. Tente novamente.",
        ),
      );
    }
  };

  const confirmarExclusao = () => {
    if (excluindo) {
      return;
    }

    Alert.alert(
      "Excluir ocorrência?",
      "Esta ação removerá permanentemente esta ocorrência e os registros relacionados.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => void excluirOcorrencia(),
        },
      ],
    );
  };

  if (!mounted) {
    return null;
  }

  const statusColors = occurrence
    ? getStatusColors(occurrence.status_badge)
    : getStatusColors("");

  const urgencyColors = occurrence
    ? getUrgencyColors(occurrence.nivel_urgencia)
    : getUrgencyColors("");

  const tituloOcorrencia =
    normalizarTexto(occurrence?.tipo_ocorrencia) ||
    "Ocorrência";

  const nomeAnimal =
    normalizarTexto(occurrence?.tipo_animal) ||
    "Animal não informado";

  const ehProprietario = Boolean(
    occurrence && Number(user?.id) === occurrence.id_conta,
  );

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={fechar}
    >
      <View style={styles.modalRoot}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityRole="button"
            accessibilityLabel="Fechar detalhes da ocorrência"
            onPress={fechar}
          />
        </Animated.View>

        <Modal
          visible={historicoVisivel}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setHistoricoVisivel(false)
          }
        >
          <View style={styles.historyBackdrop}>
            <View style={styles.historyModal}>
              <View style={styles.historyHeader}>
                <View style={styles.historyHeaderContent}>
                  <Text style={styles.historyTitle}>
                    Histórico de cuidados
                  </Text>

                  <Text style={styles.historySubtitle}>
                    Água e comida registradas nesta
                    ocorrência.
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fechar histórico"
                  onPress={() =>
                    setHistoricoVisivel(false)
                  }
                  style={({ pressed }) => [
                    styles.closeHistoryButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name="close"
                    size={21}
                    color={COLORS.textTitle}
                  />
                </Pressable>
              </View>

              {carregandoHistorico ? (
                <View style={styles.historyState}>
                  <ActivityIndicator
                    color={COLORS.primary}
                  />

                  <Text style={styles.historyStateText}>
                    Carregando histórico...
                  </Text>
                </View>
              ) : erroHistorico ? (
                <View style={styles.historyState}>
                  <View style={styles.historyErrorIcon}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={25}
                      color={COLORS.danger}
                    />
                  </View>

                  <Text style={styles.historyErrorText}>
                    {erroHistorico}
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Tentar novamente"
                    onPress={() =>
                      void carregarHistorico()
                    }
                    style={({ pressed }) => [
                      styles.retryButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={17}
                      color={COLORS.primary}
                    />

                    <Text style={styles.retryButtonText}>
                      Tentar novamente
                    </Text>
                  </Pressable>
                </View>
              ) : historico?.length ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={
                    styles.historyList
                  }
                >
                  {historico.map((item, index) => {
                    const agua =
                      item.tipo_cuidado === "AGUA";

                    return (
                      <React.Fragment
                        key={item.id_historico}
                      >
                        <View style={styles.historyItem}>
                          <View
                            style={styles.historyItemIcon}
                          >
                            <MaterialCommunityIcons
                              name={
                                agua ? "water" : "food"
                              }
                              size={21}
                              color={COLORS.primary}
                            />
                          </View>

                          <View
                            style={
                              styles.historyItemContent
                            }
                          >
                            <Text
                              style={styles.historyItemTitle}
                            >
                              {agua ? "Água" : "Comida"}
                            </Text>

                            <Text
                              style={styles.historyItemDate}
                            >
                              {formatarDataHora(
                                item.data_cuidado
                              )}
                            </Text>

                            <View style={styles.authorRow}>
                              <Ionicons
                                name="person-outline"
                                size={13}
                                color={COLORS.textBody}
                              />

                              <Text
                                style={
                                  styles.historyItemAuthor
                                }
                                numberOfLines={1}
                              >
                                {item.usuario.nome}
                              </Text>
                            </View>

                            <Text
                              style={
                                styles.historyRegistered
                              }
                            >
                              Registrado em{" "}
                              {formatarDataHora(
                                item.data_registro
                              )}
                            </Text>
                          </View>
                        </View>

                        {index < historico.length - 1 ? (
                          <View
                            style={styles.historyDivider}
                          />
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </ScrollView>
              ) : (
                <View style={styles.historyState}>
                  <View style={styles.historyEmptyIcon}>
                    <Ionicons
                      name="time-outline"
                      size={26}
                      color={COLORS.primary}
                    />
                  </View>

                  <Text style={styles.historyEmptyTitle}>
                    Nenhum cuidado registrado
                  </Text>

                  <Text style={styles.historyStateText}>
                    Os registros de água e comida
                    aparecerão aqui.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>

        <Animated.View
          style={[
            styles.drawer,
            {
              width: DRAWER_WIDTH,
              transform: [{ translateX }],
            },
          ]}
        >
          <SafeAreaView
            edges={["top", "bottom"]}
            style={styles.safeArea}
          >
            <View style={styles.header}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar detalhes"
                hitSlop={8}
                onPress={fechar}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={23}
                  color={COLORS.textTitle}
                />
              </Pressable>

              <View style={styles.headerContent}>
                <Text
                  style={styles.headerTitle}
                  numberOfLines={1}
                >
                  Ocorrência
                </Text>

                <Text style={styles.headerSubtitle}>
                  {occurrence
                    ? `Registro #${occurrence.id_ocorrencia}`
                    : "PetRadar"}
                </Text>
              </View>

              <View style={styles.headerPlaceholder} />
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingIcon}>
                  <MaterialCommunityIcons
                    name="paw"
                    size={31}
                    color={COLORS.primary}
                  />
                </View>

                <ActivityIndicator
                  color={COLORS.primary}
                />

                <Text style={styles.loadingTitle}>
                  Carregando ocorrência
                </Text>

                <Text style={styles.loadingText}>
                  Buscando os dados registrados.
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <View style={styles.errorIcon}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={32}
                    color={COLORS.danger}
                  />
                </View>

                <Text style={styles.errorTitle}>
                  Não foi possível carregar
                </Text>

                <Text style={styles.errorText}>
                  {error}
                </Text>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fechar"
                  onPress={fechar}
                  style={({ pressed }) => [
                    styles.errorButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.errorButtonText}>
                    Fechar
                  </Text>
                </Pressable>
              </View>
            ) : occurrence ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <View style={styles.hero}>
                  <View style={styles.photoContainer}>
                    {normalizarTexto(occurrence.foto) ? (
                      <Image
                        source={{ uri: occurrence.foto }}
                        style={styles.photo}
                        resizeMode="cover"
                        accessibilityLabel="Foto da ocorrência"
                      />
                    ) : (
                      <View style={styles.photoPlaceholder}>
                        <MaterialCommunityIcons
                          name="paw"
                          size={48}
                          color={COLORS.primary}
                        />

                        <Text
                          style={styles.photoPlaceholderText}
                        >
                          Foto não disponível
                        </Text>
                      </View>
                    )}

                    <View style={styles.photoShade} />

                    <View style={styles.photoOccurrenceTag}>
                      <Ionicons
                        name="alert-circle"
                        size={15}
                        color={COLORS.white}
                      />

                      <Text
                        style={styles.photoOccurrenceTagText}
                      >
                        {tituloOcorrencia}
                      </Text>
                    </View>

                    <View style={styles.photoIdTag}>
                      <Text style={styles.photoIdTagText}>
                        #{occurrence.id_ocorrencia}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.heroContent}>
                    <View style={styles.heroHeading}>
                      <View style={styles.heroHeadingText}>
                        <Text
                          style={styles.animalName}
                          numberOfLines={1}
                        >
                          {nomeAnimal}
                        </Text>

                        {normalizarTexto(occurrence.raca) ? (
                          <Text
                            style={styles.animalBreed}
                            numberOfLines={1}
                          >
                            {occurrence.raca}
                          </Text>
                        ) : null}
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              statusColors.background,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor:
                                statusColors.text,
                            },
                          ]}
                        />

                        <Text
                          style={[
                            styles.statusText,
                            {
                              color: statusColors.text,
                            },
                          ]}
                        >
                          {occurrence.status_badge}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.occurrenceSummary}>
                      <View style={styles.summaryRow}>
                        <View style={styles.summaryIcon}>
                          <Ionicons
                            name="location-outline"
                            size={18}
                            color={COLORS.primary}
                          />
                        </View>

                        <View style={styles.summaryContent}>
                          <Text style={styles.summaryLabel}>
                            Local da ocorrência
                          </Text>

                          <Text style={styles.summaryValue}>
                            {normalizarTexto(
                              occurrence.endereco_localizacao
                            ) || "Localização não informada"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.summaryDivider} />

                      <View style={styles.summaryRow}>
                        <View style={styles.summaryIcon}>
                          <Ionicons
                            name="calendar-outline"
                            size={18}
                            color={COLORS.primary}
                          />
                        </View>

                        <View style={styles.summaryContent}>
                          <Text style={styles.summaryLabel}>
                            Data da ocorrência
                          </Text>

                          <Text style={styles.summaryValue}>
                            {formatarData(
                              occurrence.data_ocorrencia
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.urgencyBadge,
                          {
                            backgroundColor:
                              urgencyColors.background,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="alert-circle-outline"
                          size={16}
                          color={urgencyColors.text}
                        />

                        <Text
                          style={[
                            styles.urgencyText,
                            {
                              color: urgencyColors.text,
                            },
                          ]}
                        >
                          Urgência:{" "}
                          {occurrence.nivel_urgencia}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.content}>
                  <View style={styles.section}>
                    <SectionHeader
                      title="Sobre o animal"
                      subtitle="Características informadas nesta ocorrência."
                    />

                    <DetailsCard
                      items={[
                        {
                          icon: "paw-outline",
                          label: "Animal",
                          value: occurrence.tipo_animal,
                        },
                        {
                          icon: "ribbon-outline",
                          label: "Raça",
                          value: occurrence.raca,
                        },
                        {
                          icon: "male-female-outline",
                          label: "Sexo",
                          value: occurrence.sexo,
                        },
                        {
                          icon: "color-palette-outline",
                          label: "Cor",
                          value: occurrence.cor,
                        },
                        {
                          icon: "resize-outline",
                          label: "Porte",
                          value: occurrence.porte,
                        },
                        {
                          icon: "calendar-outline",
                          label: "Idade",
                          value: occurrence.idade,
                        },
                      ]}
                    />
                  </View>

                  {(occurrence.saude_critica ||
                    normalizarTexto(
                      occurrence.saude_detalhes
                    )) ? (
                    <View style={styles.section}>
                      <SectionHeader
                        title="Estado de saúde"
                        subtitle="Condição registrada para este animal."
                      />

                      <View
                        style={[
                          styles.alertCard,
                          occurrence.saude_critica
                            ? styles.alertCardDanger
                            : styles.alertCardNeutral,
                        ]}
                      >
                        <View
                          style={[
                            styles.alertIcon,
                            occurrence.saude_critica
                              ? styles.alertIconDanger
                              : styles.alertIconNeutral,
                          ]}
                        >
                          <Ionicons
                            name={
                              occurrence.saude_critica
                                ? "warning-outline"
                                : "medkit-outline"
                            }
                            size={22}
                            color={
                              occurrence.saude_critica
                                ? COLORS.danger
                                : COLORS.primary
                            }
                          />
                        </View>

                        <View style={styles.alertContent}>
                          <Text
                            style={[
                              styles.alertTitle,
                              {
                                color:
                                  occurrence.saude_critica
                                    ? COLORS.danger
                                    : COLORS.textTitle,
                              },
                            ]}
                          >
                            {occurrence.saude_critica
                              ? "Atenção necessária"
                              : "Informação de saúde"}
                          </Text>

                          <Text style={styles.alertText}>
                            {normalizarTexto(
                              occurrence.saude_detalhes
                            ) ||
                              "Existe uma informação de saúde registrada para este animal."}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}

                  {(occurrence.deficiencia ||
                    normalizarTexto(
                      occurrence.deficiencia_detalhes
                    )) ? (
                    <View style={styles.section}>
                      <SectionHeader
                        title="Necessidades especiais"
                        subtitle="Cuidados específicos registrados."
                      />

                      <View style={styles.specialCareCard}>
                        <View style={styles.specialCareIcon}>
                          <Ionicons
                            name="accessibility-outline"
                            size={22}
                            color={COLORS.primary}
                          />
                        </View>

                        <View style={styles.specialCareContent}>
                          <Text style={styles.specialCareTitle}>
                            Atenção especial
                          </Text>

                          <Text style={styles.specialCareText}>
                            {normalizarTexto(
                              occurrence.deficiencia_detalhes
                            ) ||
                              "Existe uma deficiência registrada para este animal."}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}

                  <View style={styles.section}>
                    <SectionHeader
                      title="Cuidados iniciais"
                      subtitle="Registre o cuidado no momento em que ele for realizado."
                      action={
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Abrir histórico de cuidados"
                          onPress={abrirHistorico}
                          style={({ pressed }) => [
                            styles.historyButton,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={COLORS.primary}
                          />

                          <Text
                            style={styles.historyButtonText}
                          >
                            Histórico
                          </Text>
                        </Pressable>
                      }
                    />

                    <View style={styles.careActionsCard}>
                      <View style={styles.careButtonRow}>
                        <CareButton
                          tipo="AGUA"
                          disabled={
                            tipoCuidadoCarregando !== null
                          }
                          loading={
                            tipoCuidadoCarregando === "AGUA"
                          }
                          onPress={registrarCuidadoAgora}
                        />

                        <CareButton
                          tipo="COMIDA"
                          disabled={
                            tipoCuidadoCarregando !== null
                          }
                          loading={
                            tipoCuidadoCarregando ===
                            "COMIDA"
                          }
                          onPress={registrarCuidadoAgora}
                        />
                      </View>

                      {erroCuidado ? (
                        <View style={styles.careError}>
                          <Ionicons
                            name="alert-circle-outline"
                            size={17}
                            color={COLORS.danger}
                          />

                          <Text style={styles.careErrorText}>
                            {erroCuidado}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <Text style={styles.subsectionTitle}>
                      Últimos cuidados
                    </Text>

                    <View style={styles.careInfoCard}>
                      <CareInfo
                        tipo="AGUA"
                        cuidado={
                          occurrence.cuidados_atuais?.agua ||
                          null
                        }
                      />

                      <View style={styles.careInfoDivider} />

                      <CareInfo
                        tipo="COMIDA"
                        cuidado={
                          occurrence.cuidados_atuais?.comida ||
                          null
                        }
                      />
                    </View>

                    {normalizarTexto(
                      occurrence.cuidados_iniciais
                    ) ? (
                      <View style={styles.legacyCareCard}>
                        <Ionicons
                          name="information-circle-outline"
                          size={19}
                          color={COLORS.primary}
                        />

                        <Text style={styles.legacyCareText}>
                          Registro inicial:{" "}
                          {occurrence.cuidados_iniciais}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {normalizarTexto(
                    occurrence.observacao
                  ) ? (
                    <View style={styles.section}>
                      <SectionHeader
                        title="Observações da ocorrência"
                        subtitle="Informações adicionais fornecidas no registro."
                      />

                      <View style={styles.observationCard}>
                        <View style={styles.observationIcon}>
                          <Ionicons
                            name="document-text-outline"
                            size={21}
                            color={COLORS.primary}
                          />
                        </View>

                        <Text style={styles.observationText}>
                          {occurrence.observacao}
                        </Text>
                      </View>
                    </View>
                  ) : null}

                  {ehProprietario ? (
                    <View style={styles.managementSection}>
                      <SectionHeader
                        title="Gerenciar ocorrência"
                        subtitle="Edite as informações ou remova este registro."
                      />

                      <View style={styles.managementActions}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Editar ocorrência"
                          disabled={excluindo}
                          onPress={editarOcorrencia}
                          style={({ pressed }) => [
                            styles.managementButton,
                            pressed && styles.pressed,
                            excluindo && styles.managementButtonDisabled,
                          ]}
                        >
                          <Ionicons
                            name="create-outline"
                            size={20}
                            color={COLORS.primary}
                          />
                          <Text style={styles.managementButtonText}>
                            Editar ocorrência
                          </Text>
                        </Pressable>

                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Excluir ocorrência"
                          accessibilityState={{ disabled: excluindo }}
                          disabled={excluindo}
                          onPress={confirmarExclusao}
                          style={({ pressed }) => [
                            styles.managementButton,
                            styles.managementDeleteButton,
                            pressed && styles.pressed,
                            excluindo && styles.managementButtonDisabled,
                          ]}
                        >
                          {excluindo ? (
                            <ActivityIndicator
                              size="small"
                              color={COLORS.danger}
                            />
                          ) : (
                            <Ionicons
                              name="trash-outline"
                              size={20}
                              color={COLORS.danger}
                            />
                          )}
                          <Text
                            style={[
                              styles.managementButtonText,
                              styles.managementDeleteButtonText,
                            ]}
                          >
                            {excluindo ? "Excluindo..." : "Excluir ocorrência"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : null}

                  <View style={styles.footer}>
                    <View style={styles.footerLine} />

                    <View style={styles.footerContent}>
                      <MaterialCommunityIcons
                        name="paw-outline"
                        size={16}
                        color={COLORS.muted}
                      />

                      <Text style={styles.footerText}>
                        Ocorrência #
                        {occurrence.id_ocorrencia}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            ) : null}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    flexDirection: "row",
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.overlay,
  },

  drawer: {
    height: "100%",
    marginLeft: "auto",
    overflow: "hidden",
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 26,
    borderBottomLeftRadius: 26,
    ...theme.shadows.elevation1,
  },

  safeArea: {
    flex: 1,
  },

  header: {
    minHeight: 68,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(15, 23, 42, 0.06)",
  },

  headerButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: COLORS.background,
  },

  headerContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textTitle,
  },

  headerSubtitle: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textBody,
  },

  headerPlaceholder: {
    width: 42,
    height: 42,
  },

  pressed: {
    opacity: 0.74,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.55,
  },

  scrollContent: {
    paddingBottom: 38,
  },

  hero: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: "hidden",
    ...theme.shadows.elevation1,
  },

  photoContainer: {
    width: "100%",
    height: 238,
    position: "relative",
    overflow: "hidden",
    backgroundColor: COLORS.border,
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  photoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.successBg,
  },

  photoPlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },

  photoShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.imageOverlay,
  },

  photoOccurrenceTag: {
    position: "absolute",
    left: 14,
    bottom: 14,
    maxWidth: "72%",
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 7,
    gap: 6,
    borderRadius: 12,
    backgroundColor: "rgba(15, 23, 42, 0.78)",
  },

  photoOccurrenceTagText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.white,
  },

  photoIdTag: {
    position: "absolute",
    right: 14,
    bottom: 14,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },

  photoIdTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textTitle,
  },

  heroContent: {
    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 19,
  },

  heroHeading: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  heroHeadingText: {
    flex: 1,
    minWidth: 0,
  },

  animalName: {
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: COLORS.textTitle,
  },

  animalBreed: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textBody,
  },

  statusBadge: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    borderRadius: 100,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  occurrenceSummary: {
    marginTop: 16,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.05)",
  },

  summaryRow: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  summaryIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },

  summaryContent: {
    flex: 1,
    minWidth: 0,
  },

  summaryLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textBody,
  },

  summaryValue: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    color: COLORS.textTitle,
  },

  summaryDivider: {
    height: 1,
    marginLeft: 57,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
  },

  badgeRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  urgencyBadge: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 6,
    borderRadius: 100,
  },

  urgencyText: {
    fontSize: 10,
    fontWeight: "800",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  section: {
    marginBottom: 26,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  sectionHeaderContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 9,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: COLORS.textTitle,
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textBody,
  },

  detailsCard: {
    overflow: "hidden",
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.05)",
    ...theme.shadows.elevation1,
  },

  detailRow: {
    minHeight: 69,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  detailIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 13,
    backgroundColor: COLORS.successBg,
  },

  detailContent: {
    flex: 1,
    minWidth: 0,
  },

  detailLabel: {
    marginBottom: 2,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textBody,
  },

  detailValue: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
    color: COLORS.textTitle,
  },

  detailDivider: {
    height: 1,
    marginLeft: 52,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
  },

  alertCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
  },

  alertCardDanger: {
    backgroundColor: COLORS.dangerBg,
    borderColor: "rgba(235, 87, 87, 0.16)",
  },

  alertCardNeutral: {
    backgroundColor: COLORS.surface,
    borderColor: "rgba(15, 23, 42, 0.05)",
    ...theme.shadows.elevation1,
  },

  alertIcon: {
    width: 41,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },

  alertIconDanger: {
    backgroundColor: COLORS.surface,
  },

  alertIconNeutral: {
    backgroundColor: COLORS.successBg,
  },

  alertContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },

  alertTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  alertText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textBody,
  },

  specialCareCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
    borderRadius: 18,
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.08)",
  },

  specialCareIcon: {
    width: 41,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: COLORS.surface,
  },

  specialCareContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },

  specialCareTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },

  specialCareText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textBody,
  },

  historyButton: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    gap: 5,
    borderRadius: 12,
    backgroundColor: COLORS.successBg,
  },

  historyButtonText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
  },

  careActionsCard: {
    padding: 11,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.05)",
    ...theme.shadows.elevation1,
  },

  careButtonRow: {
    flexDirection: "row",
    gap: 9,
  },

  careButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 106,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.08)",
  },

  careButtonIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
    borderRadius: 15,
    backgroundColor: COLORS.successBg,
  },

  careButtonTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textTitle,
  },

  careButtonSubtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    color: COLORS.textBody,
  },

  careError: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    gap: 7,
    borderRadius: 12,
    backgroundColor: COLORS.dangerBg,
  },

  careErrorText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    color: COLORS.danger,
  },

  subsectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textTitle,
  },

  careInfoCard: {
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.05)",
    ...theme.shadows.elevation1,
  },

  careInfo: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
  },

  careInfoIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    borderRadius: 13,
    backgroundColor: COLORS.successBg,
  },

  careInfoContent: {
    flex: 1,
    minWidth: 0,
  },

  careInfoLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textBody,
  },

  careInfoDate: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: COLORS.textTitle,
  },

  careInfoAuthor: {
    flex: 1,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textBody,
  },

  authorRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  careInfoDivider: {
    height: 1,
    marginLeft: 51,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
  },

  legacyCareCard: {
    marginTop: 11,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 11,
    gap: 7,
    borderRadius: 14,
    backgroundColor: COLORS.successBg,
  },

  legacyCareText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 16,
    color: COLORS.textBody,
  },

  observationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.05)",
    ...theme.shadows.elevation1,
  },

  observationIcon: {
    width: 41,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 13,
    backgroundColor: COLORS.successBg,
  },

  observationText: {
    flex: 1,
    paddingTop: 2,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
    color: COLORS.textTitle,
  },

  managementSection: {
    marginBottom: 20,
  },

  managementActions: {
    gap: 10,
  },

  managementButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.18)",
    borderRadius: 15,
    backgroundColor: COLORS.surface,
  },

  managementDeleteButton: {
    borderColor: "rgba(185, 28, 28, 0.18)",
    backgroundColor: COLORS.dangerBg,
  },

  managementButtonDisabled: {
    opacity: 0.55,
  },

  managementButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },

  managementDeleteButtonText: {
    color: COLORS.danger,
  },

  footer: {
    marginTop: 2,
    marginBottom: 8,
  },

  footerLine: {
    height: 1,
    marginBottom: 18,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
  },

  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  footerText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.muted,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 60,
  },

  loadingIcon: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderRadius: 31,
    backgroundColor: COLORS.successBg,
  },

  loadingTitle: {
    marginTop: 13,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textTitle,
  },

  loadingText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: COLORS.textBody,
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 50,
  },

  errorIcon: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderRadius: 32,
    backgroundColor: COLORS.dangerBg,
  },

  errorTitle: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.textTitle,
  },

  errorText: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: COLORS.textBody,
  },

  errorButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    ...theme.shadows.buttonGlow,
  },

  errorButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.white,
  },

  historyBackdrop: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
  },

  historyModal: {
    maxHeight: "80%",
    padding: 19,
    borderRadius: 23,
    backgroundColor: COLORS.background,
    ...theme.shadows.elevation1,
  },

  historyHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 17,
  },

  historyHeaderContent: {
    flex: 1,
    minWidth: 0,
  },

  historyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textTitle,
  },

  historySubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textBody,
  },

  closeHistoryButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
  },

  historyList: {
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
  },

  historyItem: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  historyItemIcon: {
    width: 41,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    borderRadius: 13,
    backgroundColor: COLORS.successBg,
  },

  historyItemContent: {
    flex: 1,
    minWidth: 0,
  },

  historyItemTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textTitle,
  },

  historyItemDate: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textTitle,
  },

  historyItemAuthor: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textBody,
  },

  historyRegistered: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: 13,
    color: COLORS.muted,
  },

  historyDivider: {
    height: 1,
    marginLeft: 52,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
  },

  historyState: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 10,
  },

  historyStateText: {
    maxWidth: 250,
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: COLORS.textBody,
  },

  historyErrorIcon: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 27,
    backgroundColor: COLORS.dangerBg,
  },

  historyErrorText: {
    maxWidth: 260,
    marginBottom: 13,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: COLORS.danger,
  },

  historyEmptyIcon: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
    borderRadius: 27,
    backgroundColor: COLORS.successBg,
  },

  historyEmptyTitle: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.textTitle,
  },

  retryButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    gap: 6,
    borderRadius: 12,
    backgroundColor: COLORS.successBg,
  },

  retryButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
  },
});
