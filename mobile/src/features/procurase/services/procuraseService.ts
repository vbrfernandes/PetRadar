import api from "../../../core/api";

import type { ProcuraSeEcoResponse } from "../types/procurase.types";

export const procuraseService = {
  toggleEco(occurrenceId: number) {
    return api.post<ProcuraSeEcoResponse>(
      `/ocorrencias/${occurrenceId}/forca`,
    );
  },

  reportOccurrence(occurrenceId: number, reason: string) {
    return api.post(
      `/ocorrencias/${occurrenceId}/denuncias`,
      {
        motivo: reason,
      },
    );
  },
};
