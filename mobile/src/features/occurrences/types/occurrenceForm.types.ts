import type { TipoAnimal, TipoOcorrencia } from "./occurrence.types";

export interface SugestaoEndereco {
  id: string;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    mapbox_id: string;
    feature_type: string;
    name: string;
    name_preferred?: string;
    place_formatted?: string;
    full_address?: string;
  };
}

export interface RespostaGeocodingMapbox {
  type: "FeatureCollection";
  features: SugestaoEndereco[];
}

export interface OcorrenciaEdicao {
  id_ocorrencia: number;
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
  deficiencia: boolean;
  deficiencia_detalhes: string | null;
  nivel_urgencia: string;
  data_ocorrencia: string;
  endereco_localizacao: string | null;
  latitude: number;
  longitude: number;
  foto: string;
  observacao: string | null;
}

export interface OccurrenceTypeOption {
  valor: TipoOcorrencia;
  titulo: string;
  descricao?: string;
  icone: string;
}

export interface AnimalTypeOption {
  valor: TipoAnimal;
  titulo: string;
  descricao?: string;
  icone: string;
}

export interface ReviewItem {
  label: string;
  value: string;
}
