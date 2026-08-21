import { theme } from "../../../theme/colors";
import type { OcorrenciaFeed, StatusVisual } from "../types/feed.types";
import { normalizarTexto } from "./feed.utils";

export function capitalizar(valor: string) {
  const texto = valor.trim().toLocaleLowerCase().replace(/_/g, " ");

  if (!texto) {
    return "Animal";
  }

  return texto.charAt(0).toLocaleUpperCase() + texto.slice(1);
}

export function formatarDistancia(
  distanciaKm: number | null | undefined,
) {
  const distancia = Number(distanciaKm);

  if (!Number.isFinite(distancia) || distancia < 0) {
    return "Distância indisponível";
  }

  if (distancia < 1) {
    return `${Math.round(distancia * 1000)} m`;
  }

  return `${distancia.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
}

export function formatarTempoRelativo(data: string) {
  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return "Data não informada";
  }

  const diferencaMs = Date.now() - date.getTime();

  if (diferencaMs <= 0) {
    return "Agora";
  }

  const minutos = Math.floor(diferencaMs / (1000 * 60));

  if (minutos < 1) {
    return "Agora";
  }

  if (minutos < 60) {
    return `há ${minutos} min`;
  }

  const horas = Math.floor(minutos / 60);

  if (horas < 24) {
    return horas === 1 ? "há 1 hora" : `há ${horas} horas`;
  }

  const dias = Math.floor(horas / 24);

  if (dias < 7) {
    return dias === 1 ? "há 1 dia" : `há ${dias} dias`;
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function obterStatusVisual(
  occurrence: OcorrenciaFeed,
): StatusVisual {
  const status = normalizarTexto(occurrence.status_badge);

  if (status.includes("perdid")) {
    return {
      label: "Perdido",
      textColor: theme.colors.semantic.danger.text,
      backgroundColor: theme.colors.semantic.danger.bg,
    };
  }

  if (status.includes("avist")) {
    return {
      label: "Avistado",
      textColor: theme.colors.semantic.warning.text,
      backgroundColor: theme.colors.semantic.warning.bg,
    };
  }

  return {
    label: "Animal de rua",
    textColor: theme.colors.semantic.success.text,
    backgroundColor: theme.colors.semantic.success.bg,
  };
}

export function obterTituloOcorrencia(occurrence: OcorrenciaFeed) {
  const animal = capitalizar(occurrence.tipo_animal);
  const status = normalizarTexto(occurrence.status_badge);

  if (status.includes("perdid")) {
    return `${animal} perdido`;
  }

  if (status.includes("avist")) {
    return `${animal} avistado`;
  }

  return `${animal} precisa de ajuda`;
}

export function obterDescricaoOcorrencia(occurrence: OcorrenciaFeed) {
  const observacao = occurrence.observacao?.trim();

  if (observacao) {
    return observacao;
  }

  const titulo = obterTituloOcorrencia(occurrence);
  const endereco = occurrence.endereco_localizacao?.trim();

  if (endereco) {
    return `${titulo}. Localização: ${endereco}.`;
  }

  return `${titulo}. Abra os detalhes para ver todas as informações desta ocorrência.`;
}

export function obterIniciais(nome: string | null | undefined) {
  const partes = (nome ?? "").trim().split(/\s+/).filter(Boolean);

  if (partes.length === 0) {
    return "PR";
  }

  if (partes.length === 1) {
    return partes[0].slice(0, 2).toLocaleUpperCase();
  }

  return (
    partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
  ).toLocaleUpperCase();
}

export function formatarQuantidadeComentarios(
  total: number | null | undefined,
) {
  const quantidade = Number.isFinite(Number(total))
    ? Math.max(0, Number(total))
    : 0;

  return quantidade === 1 ? "1 comentário" : `${quantidade} comentários`;
}
