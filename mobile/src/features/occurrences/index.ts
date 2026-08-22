export { default as CadastroOcorrenciaScreen } from "./screens/CadastroOcorrenciaScreen";
export { default as OccurrenceDetailDrawer } from "./components/detail/OccurrenceDetailDrawer";
export { default as OccurrenceCommentsModal } from "./components/comments/OccurrenceCommentsModal";
export { occurrenceService } from "./services/occurrenceService";
export { occurrenceCommentsService } from "./services/occurrenceCommentsService";
export { occurrenceCareService } from "./services/occurrenceCareService";
export type {
  OcorrenciaResumo,
  TipoAnimal,
  TipoOcorrencia,
} from "./types/occurrence.types";
export type {
  AutorComentario,
  ComentarioOcorrencia,
} from "./types/occurrenceComment.types";
export type {
  CuidadoOcorrencia,
  OcorrenciaDetalhe,
  TipoCuidado,
} from "./types/occurrenceDetail.types";
