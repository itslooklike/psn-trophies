/**
 * Конвертирует имя игры PSN в формат Stratege
 * - Stratege не умеет работать с кириллицей
 */
export const nameRepl = (name: string) =>
  name
    .replace('Ⅱ', 'II')
    .replace(/[^\w0-9' ]/g, '')
    .trim()
