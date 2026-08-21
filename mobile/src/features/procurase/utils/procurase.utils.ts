// ============================================================
// D:\PetRadar\src\mobile\src\features\procurase\utils\procurase.utils.ts
// ============================================================

export {
  ehUrgente,
  normalizarTexto,
} from "../../feed/utils/feed.utils";

import {
  DEFAULT_SEARCH_RADIUS_KM,
  MAX_SEARCH_RADIUS_KM,
  MIN_SEARCH_RADIUS_KM,
} from "../constants/procurase.constants";

export function normalizarRaioPesquisa(value: unknown) {
  const radius = Number(value);

  if (!Number.isFinite(radius)) {
    return DEFAULT_SEARCH_RADIUS_KM;
  }

  return Math.min(
    MAX_SEARCH_RADIUS_KM,
    Math.max(MIN_SEARCH_RADIUS_KM, radius),
  );
}
