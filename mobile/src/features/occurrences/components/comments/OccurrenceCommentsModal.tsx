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
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";

import axios from "axios";

import { occurrenceService } from "../../services/occurrenceService";

import type {
  AutorComentario,
  ComentarioOcorrencia,
} from "../../types/occurrence.types";
import CommentAuthorModal from "./CommentAuthorModal";

import { useAuthStore } from "../../../../store/useAuthStore";

import { theme } from "../../../../theme/colors";

interface OccurrenceCommentsModalProps {
  visible: boolean;
  occurrenceId: number | null;
  onClose: () => void;
}

const COLORS = {
  primary: theme.colors.brand,
  action: theme.colors.action,

  background: theme.colors.background,
  surface: theme.colors.surface,

  textTitle: theme.colors.textTitle,
  textBody: theme.colors.textBody,

  danger: theme.colors.semantic.danger.text,
  dangerBg: theme.colors.semantic.danger.bg,

  successBg: theme.colors.semantic.success.bg,

  white: "#FFFFFF",

  border: "rgba(15, 23, 42, 0.07)",

  subtleBorder: "rgba(15, 23, 42, 0.055)",

  accentSoft: "rgba(31, 92, 77, 0.065)",

  accentBorder: "rgba(31, 92, 77, 0.14)",

  mutedSurface: "rgba(15, 23, 42, 0.028)",

  overlay: "rgba(15, 23, 42, 0.56)",
};

function obterIniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);

  if (partes.length === 0) {
    return "PR";
  }

  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase();
  }

  return (
    partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
  ).toUpperCase();
}

function formatarHorario(valor: string) {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "";
  }

  const agora = new Date();

  const mesmoDia =
    data.getDate() === agora.getDate() &&
    data.getMonth() === agora.getMonth() &&
    data.getFullYear() === agora.getFullYear();

  if (mesmoDia) {
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mensagemErroApi(error: unknown, fallback: string) {
  if (
    axios.isAxiosError<{
      detail?: unknown;
    }>(error)
  ) {
    const detalhe = error.response?.data?.detail;

    if (typeof detalhe === "string") {
      return detalhe;
    }
  }

  return fallback;
}

interface CommentItemProps {
  comentario: ComentarioOcorrencia;

  meu: boolean;

  podeResponder?: boolean;
  onAuthorPress: (author: AutorComentario) => void;

  onReply: (comentario: ComentarioOcorrencia) => void;

  onEdit: (comentario: ComentarioOcorrencia) => void;

  onDelete: (comentario: ComentarioOcorrencia) => void;
}

function CommentItem({
  comentario,
  meu,
  podeResponder = true,
  onAuthorPress,
  onReply,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const nome = comentario.autor.nome?.trim() || "Usuário PetRadar";

  const foto = comentario.autor.foto?.trim() || null;

  const excluido = comentario.excluido_em !== null;

  const editado = comentario.editado_em !== null;

  const abrirAutor = () => {
    onAuthorPress(comentario.autor);
  };

  const abrirOpcoes = () => {
    if (!meu || excluido) {
      return;
    }

    Alert.alert("Comentário", "Escolha uma ação para o seu comentário.", [
      {
        text: "Editar",
        onPress: () => onEdit(comentario),
      },

      {
        text: "Excluir",
        style: "destructive",
        onPress: () => onDelete(comentario),
      },

      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.commentRow}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver identificação de ${nome}`}
        onPress={abrirAutor}
        style={({ pressed }) => [
          styles.commentAvatar,

          pressed && styles.authorPressed,
        ]}
      >
        {foto ? (
          <Image
            source={{
              uri: foto,
            }}
            style={styles.commentAvatarImage}
            accessibilityLabel={`Foto de ${nome}`}
          />
        ) : (
          <Text style={styles.commentAvatarInitials}>
            {obterIniciais(nome)}
          </Text>
        )}
      </Pressable>

      <View style={styles.commentBody}>
        {/* =============================================
                    CABEÇALHO
                ============================================== */}

        <View style={styles.commentHeader}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ver identificação de ${nome}`}
            onPress={abrirAutor}
            style={({ pressed }) => [
              styles.commentAuthorButton,

              pressed && styles.authorPressed,
            ]}
          >
            <Text style={styles.commentAuthorName} numberOfLines={1}>
              {nome}
            </Text>

            {meu ? (
              <View style={styles.youBadge}>
                <Text style={styles.youBadgeText}>Você</Text>
              </View>
            ) : null}
          </Pressable>

          <View style={styles.commentHeaderRight}>
            <View style={styles.commentMeta}>
              <Text style={styles.commentTime}>
                {formatarHorario(comentario.data_hora)}
              </Text>

              {editado && !excluido ? (
                <Text style={styles.commentEdited}>• editado</Text>
              ) : null}
            </View>

            {meu && !excluido ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Opções do comentário"
                accessibilityHint="Permite editar ou excluir seu comentário"
                hitSlop={6}
                onPress={abrirOpcoes}
                style={({ pressed }) => [
                  styles.commentOptionsButton,

                  pressed && styles.authorPressed,
                ]}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={17}
                  color={COLORS.textBody}
                />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* =============================================
                    CONTEÚDO
                ============================================== */}

        {excluido ? (
          <Text style={styles.deletedCommentText}>Comentário excluído</Text>
        ) : (
          <>
            <Text style={styles.commentText}>{comentario.texto}</Text>

            {/* =====================================
                            AÇÕES
                        ====================================== */}

            {podeResponder ? (
              <View style={styles.commentActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Responder comentário de ${nome}`}
                  onPress={() => onReply(comentario)}
                  style={({ pressed }) => [
                    styles.replyButton,

                    pressed && styles.replyButtonPressed,
                  ]}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={13}
                    color={COLORS.primary}
                  />

                  <Text style={styles.replyButtonText}>
                    Responder
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
}

export default function OccurrenceCommentsModal({
  visible,
  occurrenceId,
  onClose,
}: OccurrenceCommentsModalProps) {
  const inputRef = useRef<TextInput>(null);

  const envioEmAndamento = useRef(false);

  const user = useAuthStore((state) => state.user);

  const [expandido, setExpandido] = useState(false);

  const [comentarios, setComentarios] = useState<ComentarioOcorrencia[]>([]);

  const [texto, setTexto] = useState("");

  const [carregando, setCarregando] = useState(false);

  const [enviando, setEnviando] = useState(false);

  const [erro, setErro] = useState<string | null>(null);

  const [respondendoA, setRespondendoA] = useState<ComentarioOcorrencia | null>(
    null,
  );

  const [editandoComentario, setEditandoComentario] =
    useState<ComentarioOcorrencia | null>(null);

  const [comentarioEmAcaoId, setComentarioEmAcaoId] = useState<number | null>(
    null,
  );

  const [autorSelecionado, setAutorSelecionado] =
    useState<AutorComentario | null>(null);

  const [comentariosExpandidos, setComentariosExpandidos] = useState<
    Set<number>
  >(new Set());

  /*
   * =========================================
   * AGRUPAMENTO DE COMENTÁRIOS
   * =========================================
   *
   * comentariosRaiz:
   * comentários que não respondem a nenhum outro.
   *
   * respostasPorPai:
   * respostas agrupadas pelo comentário principal.
   */

  const comentariosRaiz = useMemo(
    () =>
      comentarios.filter((comentario) => comentario.id_comentario_pai === null),
    [comentarios],
  );

  const respostasPorPai = useMemo(() => {
    const mapa = new Map<number, ComentarioOcorrencia[]>();

    comentarios.forEach((comentario) => {
      if (comentario.id_comentario_pai === null) {
        return;
      }

      const respostasAtuais = mapa.get(comentario.id_comentario_pai) ?? [];

      respostasAtuais.push(comentario);

      mapa.set(comentario.id_comentario_pai, respostasAtuais);
    });

    return mapa;
  }, [comentarios]);

  const alternarRespostas = useCallback((comentarioId: number) => {
    setComentariosExpandidos((atuais) => {
      const proximo = new Set(atuais);

      if (proximo.has(comentarioId)) {
        proximo.delete(comentarioId);
      } else {
        proximo.add(comentarioId);
      }

      return proximo;
    });
  }, []);

  const ocultarRespostas = useCallback((comentarioId: number) => {
    setComentariosExpandidos((atuais) => {
      const proximo = new Set(atuais);

      proximo.delete(comentarioId);

      return proximo;
    });
  }, []);

  const carregarComentarios = useCallback(async () => {
    if (occurrenceId === null) {
      return;
    }

    try {
      setCarregando(true);
      setErro(null);

      const response = await occurrenceService.getComments(occurrenceId);

      setComentarios(response.data);
    } catch (error: unknown) {
      setErro(
        mensagemErroApi(error, "Não foi possível carregar os comentários."),
      );
    } finally {
      setCarregando(false);
    }
  }, [occurrenceId]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setExpandido(false);

    setTexto("");

    setComentarios([]);

    setErro(null);

    setAutorSelecionado(null);

    setRespondendoA(null);

    setEditandoComentario(null);

    setComentarioEmAcaoId(null);
    
    setComentariosExpandidos(new Set());

    envioEmAndamento.current = false;

    void carregarComentarios();
  }, [visible, carregarComentarios]);

  const cancelarModoComposer = useCallback(() => {
    setRespondendoA(null);

    setEditandoComentario(null);

    setTexto("");
  }, []);

  const focarComposer = useCallback(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const iniciarResposta = useCallback(
    (comentario: ComentarioOcorrencia) => {
      if (comentario.excluido_em !== null) {
        return;
      }

      setEditandoComentario(null);

      setRespondendoA(comentario);

      setTexto("");

      focarComposer();
    },
    [focarComposer],
  );

  const iniciarEdicao = useCallback(
    (comentario: ComentarioOcorrencia) => {
      if (comentario.excluido_em !== null) {
        return;
      }

      setRespondendoA(null);

      setEditandoComentario(comentario);

      setTexto(comentario.texto);

      focarComposer();
    },
    [focarComposer],
  );

  const excluirComentario = useCallback(
    async (comentario: ComentarioOcorrencia) => {
      if (occurrenceId === null || comentarioEmAcaoId !== null) {
        return;
      }

      try {
        setComentarioEmAcaoId(comentario.id_comentario);

        setErro(null);

        await occurrenceService.deleteComment(
          occurrenceId,
          comentario.id_comentario,
        );

        /*
         * Exclusão lógica.
         *
         * Não removemos o comentário do array,
         * porque no próximo passo suas respostas
         * serão agrupadas abaixo dele.
         */
        setComentarios((atuais) =>
          atuais.map((item) => {
            if (item.id_comentario !== comentario.id_comentario) {
              return item;
            }

            return {
              ...item,

              texto: "",

              excluido_em: new Date().toISOString(),
            };
          }),
        );

        if (editandoComentario?.id_comentario === comentario.id_comentario) {
          cancelarModoComposer();
        }

        if (respondendoA?.id_comentario === comentario.id_comentario) {
          cancelarModoComposer();
        }
      } catch (error: unknown) {
        setErro(
          mensagemErroApi(error, "Não foi possível excluir o comentário."),
        );
      } finally {
        setComentarioEmAcaoId(null);
      }
    },
    [
      occurrenceId,
      comentarioEmAcaoId,
      editandoComentario,
      respondendoA,
      cancelarModoComposer,
    ],
  );

  const solicitarExclusao = useCallback(
    (comentario: ComentarioOcorrencia) => {
      Alert.alert(
        "Excluir comentário",
        "O comentário será removido, mas eventuais respostas serão preservadas.",
        [
          {
            text: "Cancelar",

            style: "cancel",
          },

          {
            text: "Excluir",

            style: "destructive",

            onPress: () => void excluirComentario(comentario),
          },
        ],
      );
    },
    [excluirComentario],
  );

  const enviarComentario = async () => {
    if (occurrenceId === null || envioEmAndamento.current) {
      return;
    }

    const mensagem = texto.trim();

    if (!mensagem) {
      return;
    }

    envioEmAndamento.current = true;

    try {
      setEnviando(true);

      setErro(null);

      /*
       * =========================================
       * EDIÇÃO
       * =========================================
       */

      if (editandoComentario) {
        const response = await occurrenceService.updateComment(
          occurrenceId,
          editandoComentario.id_comentario,
          {
            texto: mensagem,
          },
        );

        setComentarios((atuais) =>
          atuais.map((comentario) =>
            comentario.id_comentario === response.data.id_comentario
              ? response.data
              : comentario,
          ),
        );

        setTexto("");

        setEditandoComentario(null);

        return;
      }

      /*
       * =========================================
       * NOVO COMENTÁRIO / RESPOSTA
       * =========================================
       */

      const response = await occurrenceService.createComment(occurrenceId, {
        texto: mensagem,

        id_comentario_pai: respondendoA?.id_comentario ?? null,
      });

      setComentarios((atuais) => [...atuais, response.data]);


      if (respondendoA !== null) {
        const idComentarioRaiz =
          respondendoA.id_comentario_pai ??
          respondendoA.id_comentario;

        setComentariosExpandidos((atuais) => {
          const proximo = new Set(atuais);

          proximo.add(idComentarioRaiz);

          return proximo;
        });
      }

      setTexto("");

      setRespondendoA(null);
    } catch (error: unknown) {
      setErro(
        mensagemErroApi(
          error,

          editandoComentario
            ? "Não foi possível editar o comentário."
            : respondendoA
              ? "Não foi possível enviar a resposta."
              : "Não foi possível enviar o comentário.",
        ),
      );
    } finally {
      envioEmAndamento.current = false;

      setEnviando(false);
    }
  };
  const meuId = Number(user?.id);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalRoot}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="Fechar comentários"
          onPress={onClose}
        />

        <CommentAuthorModal
          visible={autorSelecionado !== null}
          author={autorSelecionado}
          onClose={() => setAutorSelecionado(null)}
        />

        <View
          style={[
            styles.panel,

            expandido ? styles.panelExpanded : styles.panelCollapsed,
          ]}
        >
          <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
            {!expandido ? (
              <View style={styles.handleArea}>
                <View style={styles.handle} />
              </View>
            ) : null}

            {/* =================================================
                HEADER
            ================================================= */}

            <View style={styles.header}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar comentários"
                hitSlop={8}
                onPress={onClose}
                style={({ pressed }) => [
                  styles.headerButton,

                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="close" size={22} color={COLORS.textTitle} />
              </Pressable>

              <View style={styles.headerContent}>
                <View style={styles.headerTitleRow}>
                  <MaterialCommunityIcons
                    name="message-text-outline"
                    size={18}
                    color={COLORS.primary}
                  />

                  <Text style={styles.headerTitle} numberOfLines={1}>
                    Comentários
                  </Text>
                </View>

                <Text style={styles.headerSubtitle}>
                  {occurrenceId !== null
                    ? `Ocorrência #${occurrenceId}`
                    : "Ocorrência"}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  expandido
                    ? "Reduzir comentários"
                    : "Abrir comentários em tela cheia"
                }
                accessibilityHint={
                  expandido
                    ? "Volta ao painel de comentários"
                    : "Expande os comentários para ocupar toda a tela"
                }
                onPress={() => setExpandido((atual) => !atual)}
                style={({ pressed }) => [
                  styles.headerButton,

                  styles.expandButton,

                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name={expandido ? "contract-outline" : "expand-outline"}
                  size={20}
                  color={COLORS.primary}
                />
              </Pressable>
            </View>

            {/* =================================================
                CONTEXTO
            ================================================= */}

            <View style={styles.contextBar}>
              <View style={styles.contextIcon}>
                <MaterialCommunityIcons
                  name="paw"
                  size={16}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.contextContent}>
                <Text style={styles.contextTitle}>
                  Comentários da comunidade
                </Text>

                <Text style={styles.contextText} numberOfLines={1}>
                  Compartilhe informações úteis sobre esta ocorrência.
                </Text>
              </View>
            </View>

            {/* =================================================
                COMENTÁRIOS
            ================================================= */}

            <View style={styles.messagesContainer}>
              {carregando ? (
                <View style={styles.stateContainer}>
                  <View style={styles.stateIcon}>
                    <ActivityIndicator color={COLORS.primary} />
                  </View>

                  <Text style={styles.stateTitle}>Carregando comentários</Text>

                  <Text style={styles.stateText}>
                    Buscando os comentários desta ocorrência.
                  </Text>
                </View>
              ) : erro && comentarios.length === 0 ? (
                <View style={styles.stateContainer}>
                  <View style={[styles.stateIcon, styles.errorStateIcon]}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={25}
                      color={COLORS.danger}
                    />
                  </View>

                  <Text style={styles.stateTitle}>
                    Não foi possível carregar
                  </Text>

                  <Text style={styles.stateText}>{erro}</Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Tentar carregar comentários novamente"
                    onPress={() => void carregarComentarios()}
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

                    <Text style={styles.retryButtonText}>Tentar novamente</Text>
                  </Pressable>
                </View>
              ) : (
                <FlatList
                  data={comentariosRaiz}
                  keyExtractor={(item) => String(item.id_comentario)}                  
                  renderItem={({ item }) => {
                    /*
                     * =========================================
                     * NÍVEL 1
                     * Respostas diretas ao comentário principal
                     * =========================================
                     */

                    const respostas =
                      respostasPorPai.get(item.id_comentario) ?? [];

                    /*
                     * =========================================
                     * CONTAGEM TOTAL DA THREAD
                     *
                     * Conta:
                     * - respostas
                     * - respostas das respostas
                     * =========================================
                     */

                    const quantidadeRespostas = respostas.reduce(
                      (total, resposta) => {
                        const respostasDaResposta =
                          respostasPorPai.get(resposta.id_comentario) ?? [];

                        return total + 1 + respostasDaResposta.length;
                      },
                      0,
                    );

                    const respostasVisiveis =
                      comentariosExpandidos.has(item.id_comentario);

                    return (
                      <View style={styles.commentThread}>
                        {/* =====================================
                            NÍVEL 0
                            COMENTÁRIO PRINCIPAL
                        ====================================== */}

                        <CommentItem
                          comentario={item}
                          meu={Number(item.id_conta) === meuId}
                          podeResponder
                          onAuthorPress={setAutorSelecionado}
                          onReply={iniciarResposta}
                          onEdit={iniciarEdicao}
                          onDelete={solicitarExclusao}
                        />

                        {/* =====================================
                            ABRIR / FECHAR THREAD
                        ====================================== */}

                        {quantidadeRespostas > 0 ? (
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={
                              respostasVisiveis
                                ? "Ocultar respostas"
                                : `Mostrar ${quantidadeRespostas} ${
                                    quantidadeRespostas === 1
                                      ? "resposta"
                                      : "respostas"
                                  }`
                            }
                            onPress={() =>
                              alternarRespostas(item.id_comentario)
                            }
                            style={({ pressed }) => [
                              styles.repliesToggleButton,

                              pressed && styles.repliesToggleButtonPressed,
                            ]}
                          >
                            <View style={styles.repliesToggleLine} />

                            <Ionicons
                              name={
                                respostasVisiveis
                                  ? "chevron-up"
                                  : "chevron-down"
                              }
                              size={14}
                              color={COLORS.primary}
                            />

                            <Text style={styles.repliesToggleText}>
                              {respostasVisiveis
                                ? `${quantidadeRespostas} ${
                                    quantidadeRespostas === 1
                                      ? "resposta"
                                      : "respostas"
                                  }`
                                : `Ver ${quantidadeRespostas} ${
                                    quantidadeRespostas === 1
                                      ? "resposta"
                                      : "respostas"
                                  }`}
                            </Text>
                          </Pressable>
                        ) : null}

                        {/* =====================================
                            RESPOSTAS ABERTAS
                        ====================================== */}

                        {quantidadeRespostas > 0 && respostasVisiveis ? (
                          <View style={styles.repliesContainer}>
                            {respostas.map((resposta, index) => {
                              /*
                               * =================================
                               * NÍVEL 2
                               * Respostas da resposta.
                               * =================================
                               */

                              const respostasDaResposta =
                                respostasPorPai.get(resposta.id_comentario) ?? [];

                              return (
                                <View
                                  key={resposta.id_comentario}
                                  style={[
                                    styles.replyItem,

                                    index > 0 && styles.replyItemWithSpacing,
                                  ]}
                                >
                                  {/* =============================
                                      NÍVEL 1
                                      RESPOSTA
                                  ============================== */}

                                  <CommentItem
                                    comentario={resposta}
                                    meu={Number(resposta.id_conta) === meuId}
                                    podeResponder
                                    onAuthorPress={setAutorSelecionado}
                                    onReply={iniciarResposta}
                                    onEdit={iniciarEdicao}
                                    onDelete={solicitarExclusao}
                                  />

                                  {/* =============================
                                      NÍVEL 2
                                      RESPOSTA DA RESPOSTA
                                  ============================== */}

                                  {respostasDaResposta.length > 0 ? (
                                    <View style={styles.nestedRepliesContainer}>
                                      {respostasDaResposta.map(
                                        (respostaFinal, finalIndex) => (
                                          <View
                                            key={respostaFinal.id_comentario}
                                            style={[
                                              styles.nestedReplyItem,

                                              finalIndex > 0 &&
                                                styles.nestedReplyItemWithSpacing,
                                            ]}
                                          >
                                            <CommentItem
                                              comentario={respostaFinal}
                                              meu={
                                                Number(respostaFinal.id_conta) ===
                                                meuId
                                              }
                                              podeResponder={false}
                                              onAuthorPress={
                                                setAutorSelecionado
                                              }
                                              onReply={iniciarResposta}
                                              onEdit={iniciarEdicao}
                                              onDelete={solicitarExclusao}
                                            />
                                          </View>
                                        ),
                                      )}
                                    </View>
                                  ) : null}
                                </View>
                              );
                            })}

                            {/* =================================
                                OCULTAR TODA A THREAD
                            ================================== */}

                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel="Ocultar respostas"
                              onPress={() =>
                                ocultarRespostas(item.id_comentario)
                              }
                              style={({ pressed }) => [
                                styles.hideRepliesButton,

                                pressed && styles.repliesToggleButtonPressed,
                              ]}
                            >
                              <Ionicons
                                name="chevron-up"
                                size={14}
                                color={COLORS.primary}
                              />

                              <Text style={styles.hideRepliesText}>
                                Ocultar respostas
                              </Text>
                            </Pressable>
                          </View>
                        ) : null}
                      </View>
                    );
                  }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.messagesList,

                    comentariosRaiz.length === 0 && styles.messagesListEmpty,
                  ]}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <View style={styles.emptyIcon}>
                        <Ionicons
                          name="chatbubble-ellipses-outline"
                          size={30}
                          color={COLORS.primary}
                        />
                      </View>

                      <Text style={styles.emptyTitle}>
                        Nenhum comentário ainda
                      </Text>

                      <Text style={styles.emptyText}>
                        Compartilhe uma informação útil sobre esta ocorrência e
                        ajude outras pessoas da comunidade.
                      </Text>
                    </View>
                  }
                  ItemSeparatorComponent={() => (
                    <View style={styles.commentSeparator} />
                  )}
                />
              )}
            </View>

            {/* =================================================
                ERRO DE ENVIO
            ================================================= */}

            {erro && comentarios.length > 0 ? (
              <View style={styles.inlineError}>
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={COLORS.danger}
                />

                <Text style={styles.inlineErrorText}>{erro}</Text>
              </View>
            ) : null}

            {/* =================================================
                COMPOSER
            ================================================= */}
            {respondendoA || editandoComentario ? (
              <View style={styles.composerMode}>
                <View style={styles.composerModeIcon}>
                  <Ionicons
                    name={
                      editandoComentario
                        ? "create-outline"
                        : "chatbubble-outline"
                    }
                    size={16}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.composerModeContent}>
                  <Text style={styles.composerModeTitle} numberOfLines={1}>
                    {editandoComentario
                      ? "Editando seu comentário"
                      : `Respondendo a ${
                          respondendoA?.autor.nome?.trim() || "Usuário PetRadar"
                        }`}
                  </Text>

                  <Text style={styles.composerModeText} numberOfLines={1}>
                    {editandoComentario
                      ? "Altere o texto e toque em salvar."
                      : respondendoA?.texto || ""}
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    editandoComentario ? "Cancelar edição" : "Cancelar resposta"
                  }
                  onPress={cancelarModoComposer}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.composerModeClose,

                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="close" size={18} color={COLORS.textBody} />
                </Pressable>
              </View>
            ) : null}
            <View style={styles.composer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={inputRef}
                  value={texto}
                  onChangeText={setTexto}
                  placeholder={
                    editandoComentario
                      ? "Edite seu comentário..."
                      : respondendoA
                        ? "Escreva uma resposta..."
                        : "Escreva um comentário..."
                  }
                  placeholderTextColor={COLORS.textBody}
                  multiline
                  maxLength={1000}
                  editable={!enviando && comentarioEmAcaoId === null}
                  textAlignVertical="center"
                  style={styles.input}
                  accessibilityLabel={
                    editandoComentario
                      ? "Editar comentário"
                      : respondendoA
                        ? "Resposta do comentário"
                        : "Mensagem do comentário"
                  }
                />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  editandoComentario
                    ? "Salvar edição"
                    : respondendoA
                      ? "Enviar resposta"
                      : "Enviar comentário"
                }
                accessibilityState={{
                  disabled: enviando || texto.trim().length === 0,
                }}
                disabled={enviando || texto.trim().length === 0}
                onPress={() => void enviarComentario()}
                style={({ pressed }) => [
                  styles.sendButton,

                  (enviando || texto.trim().length === 0) &&
                    styles.sendButtonDisabled,

                  pressed &&
                    !enviando &&
                    texto.trim().length > 0 &&
                    styles.sendButtonPressed,
                ]}
              >
                {enviando ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Ionicons
                    name={editandoComentario ? "checkmark" : "send"}
                    size={editandoComentario ? 22 : 19}
                    color={COLORS.white}
                  />
                )}
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ============================================================
  // MODAL
  // ============================================================

  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    position: "absolute",

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor: COLORS.overlay,
  },

  panel: {
    width: "100%",

    backgroundColor: COLORS.surface,

    overflow: "hidden",

    ...theme.shadows.elevation1,
  },

  panelCollapsed: {
    height: "78%",

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  panelExpanded: {
    height: "100%",
  },

  safeArea: {
    flex: 1,
  },

  // ============================================================
  // HANDLE
  // ============================================================

  handleArea: {
    height: 16,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.surface,
  },

  handle: {
    width: 34,
    height: 4,

    borderRadius: 2,

    backgroundColor: "rgba(15, 23, 42, 0.12)",
  },

  // ============================================================
  // HEADER
  // ============================================================

  header: {
    minHeight: 58,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,

    backgroundColor: COLORS.surface,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.subtleBorder,
  },

  headerButton: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "transparent",
  },

  expandButton: {
    backgroundColor: COLORS.accentSoft,
  },

  headerContent: {
    flex: 1,

    alignItems: "center",

    paddingHorizontal: 8,
  },

  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 6,
  },

  headerTitle: {
    color: COLORS.textTitle,

    fontSize: 17,

    fontWeight: "800",
  },

  headerSubtitle: {
    marginTop: 1,

    color: COLORS.textBody,

    fontSize: 9,

    fontWeight: "500",
  },

  // ============================================================
  // CONTEXTO
  // ============================================================

  contextBar: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 8,

    backgroundColor: COLORS.background,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.subtleBorder,
  },

  contextIcon: {
    width: 30,
    height: 30,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 9,

    backgroundColor: COLORS.accentSoft,
  },

  contextContent: {
    flex: 1,

    minWidth: 0,
  },

  contextTitle: {
    color: COLORS.textTitle,

    fontSize: 11,

    fontWeight: "700",
  },

  contextText: {
    marginTop: 1,

    color: COLORS.textBody,

    fontSize: 9.5,
  },

  // ============================================================
  // LISTA
  // ============================================================

  messagesContainer: {
    flex: 1,

    backgroundColor: COLORS.surface,
  },

  messagesList: {
    paddingHorizontal: 16,

    paddingTop: 14,
    paddingBottom: 22,
  },

  messagesListEmpty: {
    flexGrow: 1,
  },

  // ============================================================
  // COMENTÁRIO
  // ============================================================

  commentRow: {
    width: "100%",

    flexDirection: "row",
    alignItems: "flex-start",

    paddingVertical: 3,
  },

  commentAvatar: {
    width: 36,
    height: 36,

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",

    borderRadius: 18,

    backgroundColor: COLORS.accentSoft,

    borderWidth: 1,
    borderColor: COLORS.accentBorder,
  },

  commentAvatarImage: {
    width: "100%",
    height: "100%",
  },

  commentAvatarInitials: {
    fontSize: 10,

    fontWeight: "800",

    color: COLORS.primary,
  },

  commentBody: {
    flex: 1,

    minWidth: 0,

    marginLeft: 10,
  },

  // ============================================================
  // HEADER DO COMENTÁRIO
  // ============================================================

  commentHeader: {
    minHeight: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  commentHeaderRight: {
    flexDirection: "row",

    alignItems: "center",

    flexShrink: 0,

    marginLeft: 8,
  },

  commentMeta: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,
  },

  commentEdited: {
    fontSize: 8.5,

    fontWeight: "500",

    color: COLORS.textBody,
  },

  commentOptionsButton: {
    width: 26,
    height: 26,

    marginLeft: 2,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 13,
  },

  commentAuthorButton: {
    flex: 1,

    minWidth: 0,

    flexDirection: "row",
    alignItems: "center",

    marginRight: 8,
  },

  commentAuthorName: {
    flexShrink: 1,

    fontSize: 12,

    fontWeight: "700",

    color: COLORS.textTitle,
  },

  youBadge: {
    marginLeft: 6,

    paddingHorizontal: 6,
    paddingVertical: 1,

    borderRadius: 6,

    backgroundColor: COLORS.accentSoft,
  },

  youBadgeText: {
    fontSize: 8,

    fontWeight: "700",

    color: COLORS.primary,
  },

  commentTime: {
    fontSize: 8.5,

    fontWeight: "500",

    color: COLORS.textBody,
  },

  // ============================================================
  // TEXTO
  // ============================================================

  commentText: {
    marginTop: 3,

    fontSize: 13,

    lineHeight: 18,

    fontWeight: "400",

    color: COLORS.textTitle,
  },

  deletedCommentText: {
    marginTop: 4,

    fontSize: 12,

    lineHeight: 18,

    fontStyle: "italic",

    color: COLORS.textBody,
  },

  // ============================================================
  // AÇÕES
  // ============================================================

  commentActions: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 5,
  },

  replyButton: {
    minHeight: 24,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 0,
    paddingRight: 6,

    gap: 4,

    backgroundColor: "transparent",
  },

  replyButtonPressed: {
    opacity: 0.55,
  },

  replyButtonText: {
    fontSize: 10,

    fontWeight: "700",

    color: COLORS.primary,
  },

  authorPressed: {
    opacity: 0.6,
  },

  // ============================================================
  // THREAD
  // ============================================================

  commentThread: {
    width: "100%",
  },

  repliesToggleButton: {
    alignSelf: "flex-start",

    flexDirection: "row",

    alignItems: "center",

    marginTop: 6,
    marginLeft: 46,

    minHeight: 26,

    paddingRight: 6,

    gap: 5,
  },

  repliesToggleButtonPressed: {
    opacity: 0.55,
  },

  repliesToggleLine: {
    width: 18,
    height: 1,

    backgroundColor: COLORS.accentBorder,
  },

  repliesToggleText: {
    fontSize: 10,

    fontWeight: "700",

    color: COLORS.primary,
  },

  // ============================================================
  // PRIMEIRO NÍVEL DE RESPOSTAS
  // ============================================================

  repliesContainer: {
    marginTop: 8,
    marginLeft: 18,

    paddingLeft: 12,

    borderLeftWidth: 1,
    borderLeftColor: COLORS.accentBorder,
  },

  replyItem: {
    width: "100%",
  },

  replyItemWithSpacing: {
    marginTop: 10,

    paddingTop: 10,

    borderTopWidth: 1,
    borderTopColor: COLORS.subtleBorder,
  },

  // ============================================================
  // SEGUNDO NÍVEL DE RESPOSTAS
  // ============================================================

  nestedRepliesContainer: {
    marginTop: 8,
    marginLeft: 14,

    paddingLeft: 10,

    borderLeftWidth: 1,
    borderLeftColor: COLORS.subtleBorder,
  },

  nestedReplyItem: {
    width: "100%",
  },

  nestedReplyItemWithSpacing: {
    marginTop: 8,

    paddingTop: 8,

    borderTopWidth: 1,
    borderTopColor: COLORS.subtleBorder,
  },

  // ============================================================
  // OCULTAR RESPOSTAS
  // ============================================================

  hideRepliesButton: {
    alignSelf: "flex-start",

    flexDirection: "row",

    alignItems: "center",

    minHeight: 28,

    marginTop: 8,

    paddingHorizontal: 0,
    paddingRight: 6,

    gap: 4,

    backgroundColor: "transparent",
  },

  hideRepliesText: {
    fontSize: 10,

    fontWeight: "700",

    color: COLORS.primary,
  },

  // ============================================================
  // SEPARAÇÃO ENTRE THREADS
  // ============================================================

  commentSeparator: {
    height: 1,

    marginLeft: 46,

    marginVertical: 13,

    backgroundColor: COLORS.subtleBorder,
  },

  // ============================================================
  // MODO RESPONDER / EDITAR
  // ============================================================

  composerMode: {
    minHeight: 46,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 7,

    backgroundColor: COLORS.accentSoft,

    borderTopWidth: 1,
    borderTopColor: COLORS.subtleBorder,
  },

  composerModeIcon: {
    width: 28,
    height: 28,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 9,

    marginRight: 8,

    backgroundColor: COLORS.surface,
  },

  composerModeContent: {
    flex: 1,

    minWidth: 0,
  },

  composerModeTitle: {
    fontSize: 10.5,

    fontWeight: "700",

    color: COLORS.primary,
  },

  composerModeText: {
    marginTop: 1,

    fontSize: 9.5,

    color: COLORS.textBody,
  },

  composerModeClose: {
    width: 28,
    height: 28,

    marginLeft: 8,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 14,

    backgroundColor: "transparent",
  },

  // ============================================================
  // COMPOSER
  // ============================================================

  composer: {
    flexDirection: "row",

    alignItems: "flex-end",

    paddingHorizontal: 12,

    paddingTop: 8,
    paddingBottom: 8,

    gap: 8,

    backgroundColor: COLORS.surface,

    borderTopWidth: 1,
    borderTopColor: COLORS.subtleBorder,
  },

  inputWrapper: {
    flex: 1,

    minHeight: 42,
    maxHeight: 108,

    justifyContent: "center",

    borderRadius: 14,

    paddingHorizontal: 13,

    backgroundColor: COLORS.mutedSurface,

    borderWidth: 1,
    borderColor: COLORS.subtleBorder,
  },

  input: {
    minHeight: 40,
    maxHeight: 100,

    paddingVertical: 9,

    color: COLORS.textTitle,

    fontSize: 13,

    lineHeight: 18,
  },

  sendButton: {
    width: 40,
    height: 40,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.primary,

    ...theme.shadows.buttonGlow,
  },

  sendButtonDisabled: {
    opacity: 0.38,
  },

  sendButtonPressed: {
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  // ============================================================
  // ERRO INLINE
  // ============================================================

  inlineError: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 7,

    gap: 6,

    backgroundColor: COLORS.dangerBg,
  },

  inlineErrorText: {
    flex: 1,

    color: COLORS.danger,

    fontSize: 10,

    fontWeight: "600",
  },

  // ============================================================
  // ESTADOS
  // ============================================================

  stateContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 28,
  },

  stateIcon: {
    width: 48,
    height: 48,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 11,

    backgroundColor: COLORS.accentSoft,
  },

  errorStateIcon: {
    backgroundColor: COLORS.dangerBg,
  },

  stateTitle: {
    color: COLORS.textTitle,

    fontSize: 15,

    fontWeight: "700",

    textAlign: "center",
  },

  stateText: {
    marginTop: 5,

    color: COLORS.textBody,

    fontSize: 11,

    lineHeight: 16,

    textAlign: "center",
  },

  retryButton: {
    minHeight: 36,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    marginTop: 14,

    paddingHorizontal: 12,

    gap: 5,

    borderRadius: 10,

    backgroundColor: COLORS.accentSoft,
  },

  retryButtonText: {
    color: COLORS.primary,

    fontSize: 10.5,

    fontWeight: "700",
  },

  // ============================================================
  // ESTADO VAZIO
  // ============================================================

  emptyContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 28,
  },

  emptyIcon: {
    width: 50,
    height: 50,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 11,

    backgroundColor: COLORS.accentSoft,
  },

  emptyTitle: {
    color: COLORS.textTitle,

    fontSize: 15,

    fontWeight: "700",
  },

  emptyText: {
    marginTop: 5,

    color: COLORS.textBody,

    fontSize: 11,

    lineHeight: 17,

    textAlign: "center",
  },

  // ============================================================
  // PRESS
  // ============================================================

  pressed: {
    opacity: 0.62,
  },
});
