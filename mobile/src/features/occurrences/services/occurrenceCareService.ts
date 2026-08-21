import api from "../../../services/api";

import type {
  CuidadoOcorrencia,
  TipoCuidado,
} from "../types/occurrenceDetail.types";

interface RegisterOccurrenceCarePayload {
  tipo_cuidado: TipoCuidado;
  data_cuidado: string;
}

export const occurrenceCareService = {
  register(occurrenceId: number, payload: RegisterOccurrenceCarePayload) {
    return api.post<CuidadoOcorrencia>(
      `/ocorrencias/${occurrenceId}/cuidados`,
      payload,
    );
  },

  getHistory(occurrenceId: number) {
    return api.get<CuidadoOcorrencia[]>(
      `/ocorrencias/${occurrenceId}/cuidados/historico`,
    );
  },
};
