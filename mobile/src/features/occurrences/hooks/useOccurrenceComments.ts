import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, TextInput } from "react-native";

import { occurrenceCommentsService } from "../services/occurrenceCommentsService";
import type {
  AutorComentario,
  ComentarioOcorrencia,
} from "../types/occurrenceComment.types";
import { agruparComentarios } from "../utils/occurrenceComment.utils";
import { mensagemErroApi } from "../utils/occurrenceErrors";

interface UseOccurrenceCommentsParams {
  visible: boolean;
  occurrenceId: number | null;
}

export function useOccurrenceComments({
  visible,
  occurrenceId,
}: UseOccurrenceCommentsParams) {
  const inputRef = useRef<TextInput>(null);
  const envioEmAndamento = useRef(false);
  const [expandido, setExpandido] = useState(false);
  const [comentarios, setComentarios] = useState<ComentarioOcorrencia[]>([]);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [respondendoA, setRespondendoA] =
    useState<ComentarioOcorrencia | null>(null);
  const [editandoComentario, setEditandoComentario] =
    useState<ComentarioOcorrencia | null>(null);
  const [comentarioEmAcaoId, setComentarioEmAcaoId] =
    useState<number | null>(null);
  const [autorSelecionado, setAutorSelecionado] =
    useState<AutorComentario | null>(null);
  const [comentariosExpandidos, setComentariosExpandidos] =
    useState<Set<number>>(new Set());

  const { comentariosRaiz, respostasPorPai } = useMemo(
    () => agruparComentarios(comentarios),
    [comentarios],
  );

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
      const response = await occurrenceCommentsService.getComments(occurrenceId);
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
        await occurrenceCommentsService.deleteComment(
          occurrenceId,
          comentario.id_comentario,
        );
        setComentarios((atuais) =>
          atuais.map((item) =>
            item.id_comentario === comentario.id_comentario
              ? { ...item, texto: "", excluido_em: new Date().toISOString() }
              : item,
          ),
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
          { text: "Cancelar", style: "cancel" },
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

      if (editandoComentario) {
        const response = await occurrenceCommentsService.updateComment(
          occurrenceId,
          editandoComentario.id_comentario,
          { texto: mensagem },
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

      const response = await occurrenceCommentsService.createComment(
        occurrenceId,
        {
          texto: mensagem,
          id_comentario_pai: respondendoA?.id_comentario ?? null,
        },
      );
      setComentarios((atuais) => [...atuais, response.data]);

      if (respondendoA !== null) {
        const idComentarioRaiz =
          respondendoA.id_comentario_pai ?? respondendoA.id_comentario;
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

  return {
    inputRef,
    expandido,
    setExpandido,
    comentarios,
    comentariosRaiz,
    respostasPorPai,
    texto,
    setTexto,
    carregando,
    enviando,
    erro,
    respondendoA,
    editandoComentario,
    comentarioEmAcaoId,
    autorSelecionado,
    setAutorSelecionado,
    comentariosExpandidos,
    alternarRespostas,
    ocultarRespostas,
    carregarComentarios,
    cancelarModoComposer,
    iniciarResposta,
    iniciarEdicao,
    solicitarExclusao,
    enviarComentario,
  };
}
