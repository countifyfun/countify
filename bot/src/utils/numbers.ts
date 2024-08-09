export const isNumber = (str: string) => /^\d+$/.test(str);

export function stripCommas(str: string) {
  return str.replace(/,/g, "");
}
