import React from 'react';
import { Box, alpha } from '@mui/material';

import { formatBRL, formatNumber, formatPercent, EMPTY } from '../utils/formatters';

/**
 * Como um número vira célula.
 *
 * Trinta e três das quarenta e uma colunas da lista de ações não tinham
 * formatação nenhuma: a tela mostrava `14.633095296724` e
 * `-1.61732250085` ao lado de `R$ 7,33`, com ponto e vírgula decimais
 * disputando a mesma linha. Ninguém compara dois ativos assim.
 *
 * O tipo da coluna passa a ser declarado — percentual, múltiplo, moeda,
 * contagem — e a formatação sai dele. Coluna nova nasce formatada; era isso
 * que faltava para o defeito não voltar.
 */

export const FORMATTERS = {
  percent: (value) => formatPercent(value, { digits: 1 }),
  ratio: (value) => formatNumber(value, { digits: 2 }),
  currency: (value) => formatBRL(value),
  integer: (value) => formatNumber(value, { digits: 0 }),
  // Patrimônio e liquidez chegam na casa dos bilhões: 7559573034 não é um
  // número que alguém lê, é um número que alguém conta os dígitos.
  compact: (value) => {
    if (value == null) return EMPTY;
    const abs = Math.abs(value);
    if (abs >= 1e9) return `R$ ${formatNumber(value / 1e9, { digits: 1 })} bi`;
    if (abs >= 1e6) return `R$ ${formatNumber(value / 1e6, { digits: 1 })} mi`;
    if (abs >= 1e3) return `R$ ${formatNumber(value / 1e3, { digits: 0 })} mil`;
    return formatBRL(value);
  },
};

/**
 * Pílula colorida para variação.
 *
 * Estava escrita duas vezes, com escalas de cor diferentes e cores fixas em
 * hexadecimal que ignoravam o tema — no claro elas ficavam ilegíveis.
 */
export function TrendBadge({ value, format = FORMATTERS.percent, thresholds }) {
  if (value == null) return EMPTY;

  const tone = thresholds(value);
  return (
    <Box
      component="span"
      sx={(theme) => {
        const base = theme.palette[tone]?.main ?? theme.palette.text.secondary;
        return {
          backgroundColor: alpha(base, 0.12),
          border: `1px solid ${alpha(base, 0.32)}`,
          borderRadius: 1,
          color: base,
          fontWeight: 600,
          px: 0.75,
          py: 0.25,
          whiteSpace: 'nowrap',
        };
      }}
    >
      {format(value)}
    </Box>
  );
}

/** Uma coluna numérica já formatada e alinhada à direita. */
export function numericColumn({
  accessorKey,
  id,
  header,
  kind = 'ratio',
  size = 110,
  help,
}) {
  const format = FORMATTERS[kind] ?? FORMATTERS.ratio;
  return {
    ...(id ? { id } : {}),
    accessorKey,
    header,
    size,
    filterVariant: 'range',
    enableColumnActions: false,
    // Número alinhado à direita é o que deixa as casas decimais uma embaixo
    // da outra; à esquerda, comparar duas linhas exige ler dígito por dígito.
    muiTableHeadCellProps: { align: 'right', title: help },
    muiTableBodyCellProps: { align: 'right' },
    Cell: ({ cell }) => format(cell.getValue()),
  };
}

/** Uma coluna de texto. */
export function textColumn({ accessorKey, id, header, size = 130 }) {
  return {
    ...(id ? { id } : {}),
    accessorKey,
    header,
    size,
    filterVariant: 'text',
    enableColumnActions: false,
  };
}
