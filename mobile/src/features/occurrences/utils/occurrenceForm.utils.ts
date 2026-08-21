import { TIPOS_OCORRENCIA } from "../constants/occurrence.constants";
import type { PetOcorrenciaPrefill } from "../../../navigation/navigation.types";
import type { TipoAnimal, TipoOcorrencia } from "../types/occurrence.types";

export const ehTipoOcorrencia = (valor: string): valor is TipoOcorrencia =>
  TIPOS_OCORRENCIA.some((tipo) => tipo.valor === valor);

export const separarValores = (valor: string | null): string[] =>
  valor
    ? valor
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export const criarNomeArquivo = (uri: string): string => {
  const nome = uri.split("/").pop() || `ocorrencia-${Date.now()}.jpg`;
  return nome.includes(".") ? nome : `${nome}.jpg`;
};

export const formatarEntradaData = (texto: string): string => {
  const numeros = texto.replace(/\D/g, "").slice(0, 8);
  let formatado = numeros;

  if (numeros.length >= 3) {
    formatado = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  }

  if (numeros.length >= 5) {
    formatado = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
  }

  return formatado;
};

export function interpretarDataDigitada(texto: string):
  | { kind: "incomplete" }
  | { kind: "invalid" }
  | { kind: "valid"; date: Date; formatted: string } {
  const numeros = texto.replace(/\D/g, "");

  if (numeros.length !== 8) {
    return { kind: "incomplete" };
  }

  const dia = Number(numeros.slice(0, 2));
  const mes = Number(numeros.slice(2, 4));
  const ano = Number(numeros.slice(4, 8));
  const data = new Date(ano, mes - 1, dia);
  const valida =
    dia >= 1 &&
    dia <= 31 &&
    mes >= 1 &&
    mes <= 12 &&
    ano >= 1900 &&
    ano <= 2100 &&
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia;

  if (!valida) {
    return { kind: "invalid" };
  }

  return {
    kind: "valid",
    date: data,
    formatted:
      `${String(dia).padStart(2, "0")}/` +
      `${String(mes).padStart(2, "0")}/` +
      `${ano}`,
  };
}

interface CriarOccurrenceFormDataParams {
  tipoOcorrencia: TipoOcorrencia;
  statusBadge: string;
  tipoAnimal: TipoAnimal;
  tipoAnimalOutro: string;
  latitude: number;
  longitude: number;
  endereco: string;
  dataOcorrencia: Date;
  sexo: string;
  cor: string;
  porte: string;
  idade: string;
  saudeCritica: boolean;
  problemasSelecionados: string[];
  cuidadosIniciais: string | null;
  deficiencia: boolean;
  deficienciasSelecionadas: string[];
  nivelUrgencia: string;
  observacao: string;
  ehPet: boolean;
  racaConhecida: boolean | null;
  raca: string;
  fotoUri: string;
  fotoOriginal: string | null;
  petOrigem: PetOcorrenciaPrefill | null;
  modoEdicao: boolean;
}

export function criarOccurrenceFormData({
  tipoOcorrencia,
  statusBadge,
  tipoAnimal,
  tipoAnimalOutro,
  latitude,
  longitude,
  endereco,
  dataOcorrencia,
  sexo,
  cor,
  porte,
  idade,
  saudeCritica,
  problemasSelecionados,
  cuidadosIniciais,
  deficiencia,
  deficienciasSelecionadas,
  nivelUrgencia,
  observacao,
  ehPet,
  racaConhecida,
  raca,
  fotoUri,
  fotoOriginal,
  petOrigem,
  modoEdicao,
}: CriarOccurrenceFormDataParams): FormData | null {
  const formData = new FormData();
  formData.append("tipo_ocorrencia", tipoOcorrencia);
  formData.append("status_badge", statusBadge);
  formData.append(
    "tipo_animal",
    tipoAnimal === "OUTRO" ? tipoAnimalOutro.trim() : tipoAnimal,
  );
  formData.append("latitude", String(latitude));
  formData.append("longitude", String(longitude));
  formData.append("endereco_localizacao", endereco.trim());

  const ano = dataOcorrencia.getFullYear();
  const mes = String(dataOcorrencia.getMonth() + 1).padStart(2, "0");
  const dia = String(dataOcorrencia.getDate()).padStart(2, "0");
  formData.append("data_ocorrencia", `${ano}-${mes}-${dia}T00:00:00`);
  formData.append("sexo", sexo || "");
  formData.append("cor", cor.trim() || "");
  formData.append("porte", porte || "");
  formData.append("idade", idade || "");
  formData.append("saude_critica", String(saudeCritica));
  formData.append(
    "saude_detalhes",
    problemasSelecionados.length > 0
      ? problemasSelecionados.join(", ")
      : "",
  );

  if (cuidadosIniciais !== null) {
    formData.append("cuidados_iniciais", cuidadosIniciais);
  }

  formData.append("deficiencia", String(deficiencia));
  formData.append(
    "deficiencia_detalhes",
    deficienciasSelecionadas.length > 0
      ? deficienciasSelecionadas.join(", ")
      : "",
  );
  formData.append("nivel_urgencia", nivelUrgencia);
  formData.append("observacao", observacao.trim());
  if (ehPet && racaConhecida === true) {
    formData.append("raca", raca.trim());
  } else {
    formData.append("raca", "");
  }

  const fotoEhDoPet = Boolean(petOrigem?.foto && fotoUri === petOrigem.foto);
  const fotoRemotaMantida = Boolean(
    modoEdicao &&
      fotoOriginal &&
      fotoUri === fotoOriginal &&
      /^https?:\/\//i.test(fotoUri.trim()),
  );

  if (fotoRemotaMantida) {
    return formData;
  }

  if (fotoEhDoPet && petOrigem) {
    formData.append("id_pet", String(petOrigem.id_pet));
    return formData;
  }

  if (/^https?:\/\//i.test(fotoUri.trim())) {
    return null;
  }

  formData.append(
    "foto",
    {
      uri: fotoUri,
      name: criarNomeArquivo(fotoUri),
      type: "image/jpeg",
    } as any,
  );

  return formData;
}
