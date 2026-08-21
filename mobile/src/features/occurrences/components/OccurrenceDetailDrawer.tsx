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
  Text,
  View,
} from "react-native";


import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import api from "../../../services/api";
import { useAuthStore } from "../../../store/useAuthStore";
import { theme } from "../../../theme/colors";

import { occurrenceService } from "../services/occurrenceService";

import OccurrenceCommentsModal from "./comments/OccurrenceCommentsModal";

import {
  occurrenceDetailDrawerStyles as styles,
} from "../styles/occurrenceDetail.styles";

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



function normalizarTexto(valor: string | null | undefined): string | null {
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
  const doisDigitos = (valor: number) => String(valor).padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${doisDigitos(date.getMonth() + 1)}-` +
    `${doisDigitos(date.getDate())}T` +
    `${doisDigitos(date.getHours())}:` +
    `${doisDigitos(date.getMinutes())}:` +
    `${doisDigitos(date.getSeconds())}`
  );
}

function mensagemErroApi(error: unknown, mensagemPadrao: string) {
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
      text: theme.colors.semantic.danger.text,
      background: theme.colors.semantic.danger.bg,
    };
  }

  if (normalized === "AVISTADO") {
    return {
      text: theme.colors.semantic.warning.text,
      background: theme.colors.semantic.warning.bg,
    };
  }

  return {
    text: theme.colors.semantic.success.text,
    background: theme.colors.semantic.success.bg,
  };
}

function getUrgencyColors(urgencia: string) {
  const normalized = urgencia?.toUpperCase() || "";

  if (normalized.includes("CRÍT") || normalized.includes("CRIT")) {
    return {
      text: theme.colors.semantic.danger.text,
      background: theme.colors.semantic.danger.bg,
    };
  }

  if (normalized.includes("ALTA") || normalized.includes("ALTO")) {
    return {
      text: theme.colors.semantic.warning.text,
      background: theme.colors.semantic.warning.bg,
    };
  }

  return {
    text: theme.colors.semantic.success.text,
    background: theme.colors.semantic.success.bg,
  };
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderContent}>
        <Text style={styles.sectionTitle}>{title}</Text>

        {subtitle ? (
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
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
        item,
      ): item is DetailItem & {
        valueNormalized: string;
      } => item.valueNormalized !== null,
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
              <Ionicons name={item.icon} size={19} color={theme.colors.brand} />
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{item.label}</Text>

              <Text style={styles.detailValue} numberOfLines={3}>
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

function CareButton({ tipo, disabled, loading, onPress }: CareButtonProps) {
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
          <ActivityIndicator size="small" color={theme.colors.brand} />
        ) : (
          <MaterialCommunityIcons
            name={agua ? "water" : "food"}
            size={26}
            color={theme.colors.brand}
          />
        )}
      </View>

      <Text style={styles.careButtonTitle}>{label}</Text>

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

function CareInfo({ tipo, cuidado }: CareInfoProps) {
  const agua = tipo === "AGUA";

  return (
    <View style={styles.careInfo}>
      <View style={styles.careInfoIcon}>
        <MaterialCommunityIcons
          name={agua ? "water" : "food"}
          size={20}
          color={theme.colors.brand}
        />
      </View>

      <View style={styles.careInfoContent}>
        <Text style={styles.careInfoLabel}>
          {agua ? "Última água" : "Última comida"}
        </Text>

        <Text style={styles.careInfoDate}>
          {cuidado ? formatarDataHora(cuidado.data_cuidado) : "Não registrada"}
        </Text>

        {cuidado ? (
          <View style={styles.authorRow}>
            <Ionicons name="person-outline" size={13} color={theme.colors.textBody} />

            <Text style={styles.careInfoAuthor} numberOfLines={1}>
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
  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;

  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const cuidadoEmRegistro = useRef(false);
  const exclusaoEmAndamento = useRef(false);

  const user = useAuthStore((state) => state.user);

  const [mounted, setMounted] = useState(false);
  const [occurrence, setOccurrence] = useState<OcorrenciaDetalhe | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tipoCuidadoCarregando, setTipoCuidadoCarregando] =
    useState<TipoCuidado | null>(null);

  const [erroCuidado, setErroCuidado] = useState<string | null>(null);

  const [historicoVisivel, setHistoricoVisivel] = useState(false);

  const [historico, setHistorico] = useState<CuidadoOcorrencia[] | null>(null);

  const [carregandoHistorico, setCarregandoHistorico] = useState(false);

  const [erroHistorico, setErroHistorico] = useState<string | null>(null);

  const [excluindo, setExcluindo] = useState(false);

  const [comentariosVisiveis, setComentariosVisiveis] = useState(false);

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
    setComentariosVisiveis(false);

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
        const response =
          await occurrenceService.getById<OcorrenciaDetalhe>(occurrenceId);

        if (ativo) {
          setOccurrence(response.data);
        }
      } catch (err: unknown) {
        console.warn(
          "[OccurrenceDetailDrawer] Erro ao carregar ocorrência:",
          err,
        );

        if (ativo) {
          setError(
            mensagemErroApi(
              err,
              "Não foi possível carregar os detalhes da ocorrência.",
            ),
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
  }, [visible, occurrenceId, translateX, overlayOpacity]);

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
    setComentariosVisiveis(false);
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

  const registrarCuidadoAgora = async (tipo: TipoCuidado) => {
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
        },
      );

      const novoCuidado = response.data;
      const chave = tipo === "AGUA" ? "agua" : "comida";

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

      setHistorico((atual) => (atual ? [novoCuidado, ...atual] : atual));
    } catch (err: unknown) {
      const cuidado = tipo === "AGUA" ? "a água" : "a comida";

      setErroCuidado(
        mensagemErroApi(err, `Não foi possível registrar ${cuidado}.`),
      );
    } finally {
      cuidadoEmRegistro.current = false;
      setTipoCuidadoCarregando(null);
    }
  };

  const carregarHistorico = async () => {
    if (!occurrence || carregandoHistorico) {
      return;
    }

    try {
      setCarregandoHistorico(true);
      setErroHistorico(null);

      const response = await api.get<CuidadoOcorrencia[]>(
        `/ocorrencias/${occurrence.id_ocorrencia}/cuidados/historico`,
      );

      setHistorico(response.data);
    } catch (err: unknown) {
      setErroHistorico(
        mensagemErroApi(err, "Não foi possível carregar o histórico."),
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
      await occurrenceService.deleteById(id);

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
    normalizarTexto(occurrence?.tipo_ocorrencia) || "Ocorrência";

  const nomeAnimal =
    normalizarTexto(occurrence?.tipo_animal) || "Animal não informado";

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
            style={styles.overlayPressable}
            accessibilityRole="button"
            accessibilityLabel="Fechar detalhes da ocorrência"
            onPress={fechar}
          />
        </Animated.View>

        <Modal
          visible={historicoVisivel}
          transparent
          animationType="fade"
          onRequestClose={() => setHistoricoVisivel(false)}
        >
          <View style={styles.historyBackdrop}>
            <View style={styles.historyModal}>
              <View style={styles.historyHeader}>
                <View style={styles.historyHeaderContent}>
                  <Text style={styles.historyTitle}>Histórico de cuidados</Text>

                  <Text style={styles.historySubtitle}>
                    Água e comida registradas nesta ocorrência.
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fechar histórico"
                  onPress={() => setHistoricoVisivel(false)}
                  style={({ pressed }) => [
                    styles.closeHistoryButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="close" size={21} color={theme.colors.textTitle} />
                </Pressable>
              </View>

              {carregandoHistorico ? (
                <View style={styles.historyState}>
                  <ActivityIndicator color={theme.colors.brand} />

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
                      color={theme.colors.semantic.danger.text}
                    />
                  </View>

                  <Text style={styles.historyErrorText}>{erroHistorico}</Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Tentar novamente"
                    onPress={() => void carregarHistorico()}
                    style={({ pressed }) => [
                      styles.retryButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={17}
                      color={theme.colors.brand}
                    />

                    <Text style={styles.retryButtonText}>Tentar novamente</Text>
                  </Pressable>
                </View>
              ) : historico?.length ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.historyList}
                >
                  {historico.map((item, index) => {
                    const agua = item.tipo_cuidado === "AGUA";

                    return (
                      <React.Fragment key={item.id_historico}>
                        <View style={styles.historyItem}>
                          <View style={styles.historyItemIcon}>
                            <MaterialCommunityIcons
                              name={agua ? "water" : "food"}
                              size={21}
                              color={theme.colors.brand}
                            />
                          </View>

                          <View style={styles.historyItemContent}>
                            <Text style={styles.historyItemTitle}>
                              {agua ? "Água" : "Comida"}
                            </Text>

                            <Text style={styles.historyItemDate}>
                              {formatarDataHora(item.data_cuidado)}
                            </Text>

                            <View style={styles.authorRow}>
                              <Ionicons
                                name="person-outline"
                                size={13}
                                color={theme.colors.textBody}
                              />

                              <Text
                                style={styles.historyItemAuthor}
                                numberOfLines={1}
                              >
                                {item.usuario.nome}
                              </Text>
                            </View>

                            <Text style={styles.historyRegistered}>
                              Registrado em{" "}
                              {formatarDataHora(item.data_registro)}
                            </Text>
                          </View>
                        </View>

                        {index < historico.length - 1 ? (
                          <View style={styles.historyDivider} />
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
                      color={theme.colors.brand}
                    />
                  </View>

                  <Text style={styles.historyEmptyTitle}>
                    Nenhum cuidado registrado
                  </Text>

                  <Text style={styles.historyStateText}>
                    Os registros de água e comida aparecerão aqui.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>

        <OccurrenceCommentsModal
          visible={comentariosVisiveis}
          occurrenceId={occurrence?.id_ocorrencia ?? null}
          onClose={() => setComentariosVisiveis(false)}
        />

        <Animated.View
          style={[
            styles.drawer,
            {
              width: DRAWER_WIDTH,
              transform: [{ translateX }],
            },
          ]}
        >
          <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
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
                  color={theme.colors.textTitle}
                />
              </Pressable>

              <View style={styles.headerContent}>
                <Text style={styles.headerTitle} numberOfLines={1}>
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
                    color={theme.colors.brand}
                  />
                </View>

                <ActivityIndicator color={theme.colors.brand} />

                <Text style={styles.loadingTitle}>Carregando ocorrência</Text>

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
                    color={theme.colors.semantic.danger.text}
                  />
                </View>

                <Text style={styles.errorTitle}>Não foi possível carregar</Text>

                <Text style={styles.errorText}>{error}</Text>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fechar"
                  onPress={fechar}
                  style={({ pressed }) => [
                    styles.errorButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.errorButtonText}>Fechar</Text>
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
                          color={theme.colors.brand}
                        />

                        <Text style={styles.photoPlaceholderText}>
                          Foto não disponível
                        </Text>
                      </View>
                    )}

                    <View style={styles.photoShade} />

                    <View style={styles.photoOccurrenceTag}>
                      <Ionicons
                        name="alert-circle"
                        size={15}
                        color={theme.colors.surface}
                      />

                      <Text style={styles.photoOccurrenceTagText}>
                        {tituloOcorrencia}
                      </Text>
                    </View>

                    <View style={styles.photoActions}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Abrir comentários da ocorrência"
                        accessibilityHint="Abre a conversa da comunidade sobre esta ocorrência"
                        hitSlop={6}
                        onPress={() => setComentariosVisiveis(true)}
                        style={({ pressed }) => [
                          styles.photoCommentButton,

                          pressed && styles.photoCommentButtonPressed,
                        ]}
                      >
                        <Ionicons
                          name="chatbubble-outline"
                          size={20}
                          color={theme.colors.brand}
                        />
                      </Pressable>

                      <View style={styles.photoIdTag}>
                        <Text style={styles.photoIdTagText}>
                          #{occurrence.id_ocorrencia}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.heroContent}>
                    <View style={styles.heroHeading}>
                      <View style={styles.heroHeadingText}>
                        <Text style={styles.animalName} numberOfLines={1}>
                          {nomeAnimal}
                        </Text>

                        {normalizarTexto(occurrence.raca) ? (
                          <Text style={styles.animalBreed} numberOfLines={1}>
                            {occurrence.raca}
                          </Text>
                        ) : null}
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: statusColors.background,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor: statusColors.text,
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
                            color={theme.colors.brand}
                          />
                        </View>

                        <View style={styles.summaryContent}>
                          <Text style={styles.summaryLabel}>
                            Local da ocorrência
                          </Text>

                          <Text style={styles.summaryValue}>
                            {normalizarTexto(occurrence.endereco_localizacao) ||
                              "Localização não informada"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.summaryDivider} />

                      <View style={styles.summaryRow}>
                        <View style={styles.summaryIcon}>
                          <Ionicons
                            name="calendar-outline"
                            size={18}
                            color={theme.colors.brand}
                          />
                        </View>

                        <View style={styles.summaryContent}>
                          <Text style={styles.summaryLabel}>
                            Data da ocorrência
                          </Text>

                          <Text style={styles.summaryValue}>
                            {formatarData(occurrence.data_ocorrencia)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.urgencyBadge,
                          {
                            backgroundColor: urgencyColors.background,
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
                          Urgência: {occurrence.nivel_urgencia}
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

                  {occurrence.saude_critica ||
                    normalizarTexto(occurrence.saude_detalhes) ? (
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
                                ? theme.colors.semantic.danger.text
                                : theme.colors.brand
                            }
                          />
                        </View>

                        <View style={styles.alertContent}>
                          <Text
                            style={[
                              styles.alertTitle,
                              {
                                color: occurrence.saude_critica
                                  ? theme.colors.semantic.danger.text
                                  : theme.colors.textTitle,
                              },
                            ]}
                          >
                            {occurrence.saude_critica
                              ? "Atenção necessária"
                              : "Informação de saúde"}
                          </Text>

                          <Text style={styles.alertText}>
                            {normalizarTexto(occurrence.saude_detalhes) ||
                              "Existe uma informação de saúde registrada para este animal."}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}

                  {occurrence.deficiencia ||
                    normalizarTexto(occurrence.deficiencia_detalhes) ? (
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
                            color={theme.colors.brand}
                          />
                        </View>

                        <View style={styles.specialCareContent}>
                          <Text style={styles.specialCareTitle}>
                            Atenção especial
                          </Text>

                          <Text style={styles.specialCareText}>
                            {normalizarTexto(occurrence.deficiencia_detalhes) ||
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
                            color={theme.colors.brand}
                          />

                          <Text style={styles.historyButtonText}>
                            Histórico
                          </Text>
                        </Pressable>
                      }
                    />

                    <View style={styles.careActionsCard}>
                      <View style={styles.careButtonRow}>
                        <CareButton
                          tipo="AGUA"
                          disabled={tipoCuidadoCarregando !== null}
                          loading={tipoCuidadoCarregando === "AGUA"}
                          onPress={registrarCuidadoAgora}
                        />

                        <CareButton
                          tipo="COMIDA"
                          disabled={tipoCuidadoCarregando !== null}
                          loading={tipoCuidadoCarregando === "COMIDA"}
                          onPress={registrarCuidadoAgora}
                        />
                      </View>

                      {erroCuidado ? (
                        <View style={styles.careError}>
                          <Ionicons
                            name="alert-circle-outline"
                            size={17}
                            color={theme.colors.semantic.danger.text}
                          />

                          <Text style={styles.careErrorText}>
                            {erroCuidado}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <Text style={styles.subsectionTitle}>Últimos cuidados</Text>

                    <View style={styles.careInfoCard}>
                      <CareInfo
                        tipo="AGUA"
                        cuidado={occurrence.cuidados_atuais?.agua || null}
                      />

                      <View style={styles.careInfoDivider} />

                      <CareInfo
                        tipo="COMIDA"
                        cuidado={occurrence.cuidados_atuais?.comida || null}
                      />
                    </View>

                    {normalizarTexto(occurrence.cuidados_iniciais) ? (
                      <View style={styles.legacyCareCard}>
                        <Ionicons
                          name="information-circle-outline"
                          size={19}
                          color={theme.colors.brand}
                        />

                        <Text style={styles.legacyCareText}>
                          Registro inicial: {occurrence.cuidados_iniciais}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {normalizarTexto(occurrence.observacao) ? (
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
                            color={theme.colors.brand}
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
                            color={theme.colors.brand}
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
                              color={theme.colors.semantic.danger.text}
                            />
                          ) : (
                            <Ionicons
                              name="trash-outline"
                              size={20}
                              color={theme.colors.semantic.danger.text}
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
                        color={theme.colors.muted}
                      />

                      <Text style={styles.footerText}>
                        Ocorrência #{occurrence.id_ocorrencia}
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