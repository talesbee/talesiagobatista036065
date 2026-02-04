/**
 * Remove todos os caracteres que não são números de uma string.
 * @param value string de entrada
 * @returns string apenas com números
 */
export function onlyNumbers(value: string): string {
  return value.replace(/\D+/g, '');
}
/**
 * Aplica máscara de telefone celular brasileiro: (XX) X XXXX-XXXX
 * @param value string contendo apenas números
 * @returns string formatada
 */
export function maskCellPhone(value: string): string {
  if (value === null || value === undefined) return '';
  const numbers = onlyNumbers(value);
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 11)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  // Se vier mais de 11 dígitos, corta o excesso
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}
/**
 * Aplica máscara de CPF: XXX.XXX.XXX-XX
 * @param value string, number, null ou undefined
 * @returns string formatada
 */
export function maskCPF(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = typeof value === 'number' ? value.toString() : value;
  const numbers = onlyNumbers(str).slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9)
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
}
