import api from "../../../services/api";

import type { OcorrenciaResumo } from "../types/occurrence.types";

type NearbyOccurrencesParams = {
  lat: number;
  lng: number;
  raio_km: number;
  modo?: "eco" | "proximidade";
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
};
