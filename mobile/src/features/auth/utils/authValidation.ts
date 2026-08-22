export function areTrimmedFieldsPresent(...values: string[]) {
  return values.every((value) => Boolean(value.trim()));
}

export function isFieldPresent(value: string) {
  return Boolean(value);
}

export function doPasswordsMatch(password: string, confirmation: string) {
  return password === confirmation;
}
