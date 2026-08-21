import api from "../../../core/api";

import type {
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

  deleteById(occurrenceId: number) {
    return api.delete<unknown>(`/ocorrencias/${occurrenceId}`);
  },
};
