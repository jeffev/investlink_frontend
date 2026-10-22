/**
 * Formatação em pt-BR, num lugar só.
 *
 * Antes desta extração o mesmo `toLocaleString('pt-BR', { style: 'currency' })`
 * aparecia inline em `AcaoDetalhe`, `Comparar`, `Oportunidades`,
 * `HistoricalContextCard` e `stockColumns` — cinco cópias que já divergiam no
 * número de casas decimais e no que mostrar quando o valor é nulo.
 *
 * Ausente é sempre "—", nunca 0 nem string vazia: um indicador que a empresa
 * não reporta não pode parecer zero.
 */

export const EMPTY = "—";

export function formatBRL(value, { fallback = EMPTY } = {}) {
  if (value == null) return fallback;
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatNumber(value, { digits = 2, fallback = EMPTY } = {}) {
  if (value == null) return fallback;
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatPercent(value, { digits = 2, fallback = EMPTY } = {}) {
  if (value == null) return fallback;
  return `${formatNumber(value, { digits })}%`;
}

/**
 * Despacha pelo nome do formato, para tabelas cujas colunas são declaradas
 * como dados (`{ label, key, format }`) em vez de código.
 */
export function formatValue(value, format) {
  if (value == null) return EMPTY;
  if (format === "currency") return formatBRL(value);
  if (format === "percent") return formatPercent(value);
  if (format === "number") return formatNumber(value);
  return value;
}
