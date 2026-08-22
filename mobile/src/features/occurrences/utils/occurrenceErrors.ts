import axios from "axios";

export function mensagemErroApi(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ detail?: unknown }>(error)) {
    const detalhe = error.response?.data?.detail;

    if (typeof detalhe === "string") {
      return detalhe;
    }
  }

  return fallback;
}
