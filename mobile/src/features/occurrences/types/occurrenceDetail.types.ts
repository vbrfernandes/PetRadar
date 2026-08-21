export type TipoCuidado = "AGUA" | "COMIDA";

export interface AutorCuidado {
  id_conta: number;
  nome: string;
}

export interface CuidadoOcorrencia {
  id_historico: number;
  tipo_cuidado: TipoCuidado;
  data_cuidado: string;
  data_registro: string;
  usuario: AutorCuidado;
}

export interface EstadoCuidados {
  agua: CuidadoOcorrencia | null;
  comida: CuidadoOcorrencia | null;
}

export interface OcorrenciaDetalhe {
  id_ocorrencia: number;
  id_conta: number;
  tipo_ocorrencia: string;
  status_badge: string;
  tipo_animal: string;
  raca: string | null;
  sexo: string | null;
  cor: string | null;
  porte: string | null;
  idade: string | null;
  saude_critica: boolean;
  saude_detalhes: string | null;
  cuidados_iniciais: string | null;
  cuidados_atuais: EstadoCuidados;
  deficiencia: boolean;
  deficiencia_detalhes: string | null;
  nivel_urgencia: string;
  data_ocorrencia: string;
  endereco_localizacao: string | null;
  foto: string;
  observacao: string | null;
}

export interface DetailItem {
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  label: string;
  value: string | null | undefined;
}
