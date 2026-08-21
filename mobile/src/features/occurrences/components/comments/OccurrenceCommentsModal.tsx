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
import {
  occurrenceCommentsModalStyles as styles,
} from "../../styles/occurrenceComments.styles";

interface OccurrenceCommentsModalProps {
  visible: boolean;
  occurrenceId: number | null;
  onClose: () => void;
}


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
                  color={theme.colors.textBody}
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
                    color={theme.colors.brand}
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
                <Ionicons name="close" size={22} color={theme.colors.textTitle} />
              </Pressable>

              <View style={styles.headerContent}>
                <View style={styles.headerTitleRow}>
                  <MaterialCommunityIcons
                    name="message-text-outline"
                    size={18}
                    color={theme.colors.brand}
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
                  color={theme.colors.brand}
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
                  color={theme.colors.brand}
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
                    <ActivityIndicator color={theme.colors.brand} />
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
                      color={theme.colors.semantic.danger.text}
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
                      color={theme.colors.brand}
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
                              color={theme.colors.brand}
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
                                color={theme.colors.brand}
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
                          color={theme.colors.brand}
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
                  color={theme.colors.semantic.danger.text}
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
                    color={theme.colors.brand}
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
                  <Ionicons name="close" size={18} color={theme.colors.textBody} />
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
                  placeholderTextColor={theme.colors.textBody}
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
                  <ActivityIndicator size="small" color={theme.colors.surface} />
                ) : (
                  <Ionicons
                    name={editandoComentario ? "checkmark" : "send"}
                    size={editandoComentario ? 22 : 19}
                    color={theme.colors.surface}
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