export const formatarHora = (data: Date) =>
  data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatarDataCurta = (data: Date) =>
  data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

export function formatarData(data: string): string {
  if (!data) {
    return "Data não informada";
  }

  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return data;
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatarDataHora(data: string): string {
  if (!data) {
    return "Data não informada";
  }

  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return data;
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarDataHoraParaApi(date = new Date()): string {
  const doisDigitos = (valor: number) => String(valor).padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${doisDigitos(date.getMonth() + 1)}-` +
    `${doisDigitos(date.getDate())}T` +
    `${doisDigitos(date.getHours())}:` +
    `${doisDigitos(date.getMinutes())}:` +
    `${doisDigitos(date.getSeconds())}`
  );
}

export function formatarHorarioComentario(valor: string): string {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "";
  }

  const agora = new Date();
  const mesmoDia =
    data.getDate() === agora.getDate() &&
    data.getMonth() === agora.getMonth() &&
    data.getFullYear() === agora.getFullYear();

  if (mesmoDia) {
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
