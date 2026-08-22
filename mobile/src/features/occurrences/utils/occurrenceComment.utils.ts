import type {
  ComentarioOcorrencia,
  RespostasPorComentario,
} from "../types/occurrenceComment.types";

export function obterIniciais(nome: string): string {
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

export function agruparComentarios(comentarios: ComentarioOcorrencia[]): {
  comentariosRaiz: ComentarioOcorrencia[];
  respostasPorPai: RespostasPorComentario;
} {
  const comentariosRaiz = comentarios.filter(
    (comentario) => comentario.id_comentario_pai === null,
  );
  const respostasPorPai: RespostasPorComentario = new Map();

  comentarios.forEach((comentario) => {
    if (comentario.id_comentario_pai === null) {
      return;
    }

    const respostasAtuais = respostasPorPai.get(comentario.id_comentario_pai) ?? [];
    respostasAtuais.push(comentario);
    respostasPorPai.set(comentario.id_comentario_pai, respostasAtuais);
  });

  return { comentariosRaiz, respostasPorPai };
}

export function contarRespostas(
  comentarioId: number,
  respostasPorPai: RespostasPorComentario,
): number {
  const respostas = respostasPorPai.get(comentarioId) ?? [];

  return respostas.reduce((total, resposta) => {
    const respostasDaResposta =
      respostasPorPai.get(resposta.id_comentario) ?? [];

    return total + 1 + respostasDaResposta.length;
  }, 0);
}
