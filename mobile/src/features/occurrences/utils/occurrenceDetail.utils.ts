import { theme } from "../../../theme";

export function normalizarTexto(
  valor: string | null | undefined,
): string | null {
  if (!valor) {
    return null;
  }

  const texto = String(valor).trim();

  return texto.length > 0 ? texto : null;
}

export function getStatusColors(status: string) {
  const normalized = status?.toUpperCase() || "";

  if (normalized === "PERDIDO") {
    return {
      text: theme.colors.semantic.danger.text,
      background: theme.colors.semantic.danger.bg,
    };
  }

  if (normalized === "AVISTADO") {
    return {
      text: theme.colors.semantic.warning.text,
      background: theme.colors.semantic.warning.bg,
    };
  }

  return {
    text: theme.colors.semantic.success.text,
    background: theme.colors.semantic.success.bg,
  };
}

export function getUrgencyColors(urgencia: string) {
  const normalized = urgencia?.toUpperCase() || "";

  if (normalized.includes("CRÍT") || normalized.includes("CRIT")) {
    return {
      text: theme.colors.semantic.danger.text,
      background: theme.colors.semantic.danger.bg,
    };
  }

  if (normalized.includes("ALTA") || normalized.includes("ALTO")) {
    return {
      text: theme.colors.semantic.warning.text,
      background: theme.colors.semantic.warning.bg,
    };
  }

  return {
    text: theme.colors.semantic.success.text,
    background: theme.colors.semantic.success.bg,
  };
}
