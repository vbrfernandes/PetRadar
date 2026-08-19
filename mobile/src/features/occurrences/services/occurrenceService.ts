import api from "../../../services/api";

import type {
  AtualizarComentarioPayload,
  ComentarioOcorrencia,
  CriarComentarioPayload,
  OcorrenciaResumo,
} from "../types/occurrence.types";

type NearbyOccurrencesParams = {
  lat: number;
  lng: number;
  raio_km: number;
  modo?: "eco" | "proximidade";
};

const occurrenceMultipartConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 30000,
};

export const occurrenceService = {
  getById<T>(occurrenceId: number) {
    return api.get<T>(`/ocorrencias/${occurrenceId}`);
  },

  getNearby<T>(params: NearbyOccurrencesParams) {
    return api.get<T[]>("/ocorrencias/proximas", { params });
  },

  getMine() {
    return api.get<OcorrenciaResumo[]>("/ocorrencias/minhas");
  },

  create(formData: FormData) {
    return api.post<unknown>(
      "/ocorrencias/",
      formData,
      occurrenceMultipartConfig,
    );
  },

  update(occurrenceId: number, formData: FormData) {
    return api.put<unknown>(
      `/ocorrencias/${occurrenceId}`,
      formData,
      occurrenceMultipartConfig,
    );
  },

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

  deleteById(occurrenceId: number) {
    return api.delete<unknown>(`/ocorrencias/${occurrenceId}`);
  },


};
