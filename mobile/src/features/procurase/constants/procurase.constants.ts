export const DEFAULT_SEARCH_RADIUS_KM = 10;
export const MIN_SEARCH_RADIUS_KM = 1;
export const MAX_SEARCH_RADIUS_KM = 100;

export const PROCURA_SE_REPORT_REASONS = [
  {
    id: "INFORMACAO_FALSA",
    label: "Informação falsa ou enganosa",
  },
  {
    id: "CONTEUDO_IMPROPRIO",
    label: "Conteúdo impróprio",
  },
  {
    id: "SPAM_DUPLICADA",
    label: "Spam ou publicação duplicada",
  },
  {
    id: "OUTRO",
    label: "Outro problema com a publicação",
  },
] as const;

export const PROCURA_SE_FILTERS = [
  {
    id: "TODAS",
    label: "Todas",
    icon: "apps-outline",
  },
  {
    id: "PERDIDOS",
    label: "Perdidos",
    icon: "paw-outline",
  },
  {
    id: "AVISTADOS",
    label: "Avistados",
    icon: "eye-outline",
  },
  {
    id: "URGENTES",
    label: "Urgentes",
    icon: "warning-outline",
  },
] as const;
