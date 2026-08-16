// ============================================================
// D:\PetRadar\src\mobile\src\features\feed\utils\feed.utils.ts
// ============================================================

export function normalizarTexto(
  valor:
    | string
    | null
    | undefined,
) {
  return (valor ?? "")
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    );
}

export function ehUrgente(
  nivelUrgencia: string,
) {
  const urgencia =
    normalizarTexto(
      nivelUrgencia,
    );

  return (
    urgencia.includes(
      "alta",
    ) ||
    urgencia.includes(
      "crit",
    )
  );
}
