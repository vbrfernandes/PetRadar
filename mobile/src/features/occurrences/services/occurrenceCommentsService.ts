import api from "../../../core/api";

import type {
  AtualizarComentarioPayload,
  ComentarioOcorrencia,
  CriarComentarioPayload,
} from "../types/occurrenceComment.types";

export const occurrenceCommentsService = {
  getComments(occurrenceId: number) {
    return api.get<ComentarioOcorrencia[]>(
      `/ocorrencias/${occurrenceId}/comentarios`,
    );
  },

  createComment(occurrenceId: number, payload: CriarComentarioPayload) {
    return api.post<ComentarioOcorrencia>(
      `/ocorrencias/${occurrenceId}/comentarios`,
      payload,
    );
  },

  updateComment(
    occurrenceId: number,
    commentId: number,
    payload: AtualizarComentarioPayload,
  ) {
    return api.patch<ComentarioOcorrencia>(
      `/ocorrencias/${occurrenceId}/comentarios/${commentId}`,
      payload,
    );
  },

  deleteComment(occurrenceId: number, commentId: number) {
    return api.delete<void>(
      `/ocorrencias/${occurrenceId}/comentarios/${commentId}`,
    );
  },
};
