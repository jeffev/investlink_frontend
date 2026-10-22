import React from "react";
import { Box } from "@mui/material";

import { formatCurrency, formatPercent, PnlCell } from "../utils/portfolioFormatters";

/**
 * Colunas das tabelas da carteira.
 *
 * Ficavam em dois `useMemo` de 115 linhas dentro de `Portfolio.js`, que é uma
 * página, não um catálogo de colunas. O projeto já guarda definição de coluna
 * aqui — `stockColumns.js` e `fiiColumns.js` — e estas seguem o mesmo padrão.
 *
 * Funções e não constantes porque a página as envolve em `useMemo`: manter a
 * identidade estável é decisão de quem renderiza, não de quem declara.
 */

export function getPortfolioStockColumns() {
  return [
    { accessorKey: "id", header: "ID", size: 60, enableEditing: false, Edit: () => null },
    { accessorKey: "ticker", header: "Ticker", size: 90, enableEditing: false },
    { accessorKey: "quantity", header: "Qtd", size: 80, enableEditing: false },
    {
      accessorKey: "average_price",
      header: "Preço Médio",
      size: 120,
      enableEditing: true,
      muiEditTextFieldProps: { type: "number" },
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: "current_price",
      header: "Preço Atual",
      size: 120,
      enableEditing: false,
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: "total_invested",
      header: "Total Investido",
      size: 130,
      enableEditing: false,
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: "current_value",
      header: "Valor Atual",
      size: 120,
      enableEditing: false,
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: "pnl",
      header: "Resultado (R$)",
      size: 130,
      enableEditing: false,
      Cell: ({ cell }) => <PnlCell value={cell.getValue()} formatter={formatCurrency} />,
    },
    {
      accessorKey: "pnl_percent",
      header: "Rentabilidade (%)",
      size: 140,
      enableEditing: false,
      Cell: ({ cell }) => <PnlCell value={cell.getValue()} formatter={formatPercent} />,
    },
  ];
}

export function getPortfolioFiiColumns() {
  return [
    { accessorKey: "id", header: "ID", size: 60, enableEditing: false, Edit: () => null },
    { accessorKey: "fii_ticker", header: "Ticker", size: 90, enableEditing: false },
    { accessorKey: "companyname", header: "Fundo", size: 180, enableEditing: false },
    { accessorKey: "quantity", header: "Cotas", size: 80, enableEditing: false },
    {
      accessorKey: "average_price",
      header: "Preço Médio",
      size: 120,
      enableEditing: true,
      muiEditTextFieldProps: { type: "number" },
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: "current_price",
      header: "Preço Atual",
      size: 120,
      enableEditing: false,
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: "total_invested",
      header: "Total Investido",
      size: 130,
      enableEditing: false,
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: "current_value",
      header: "Valor Atual",
      size: 120,
      enableEditing: false,
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: "pnl",
      header: "Resultado (R$)",
      size: 130,
      enableEditing: false,
      Cell: ({ cell }) => <PnlCell value={cell.getValue()} formatter={formatCurrency} />,
    },
    {
      accessorKey: "pnl_percent",
      header: "Rentabilidade (%)",
      size: 140,
      enableEditing: false,
      Cell: ({ cell }) => <PnlCell value={cell.getValue()} formatter={formatPercent} />,
    },
    {
      accessorKey: "monthly_income",
      header: "Renda Mensal",
      size: 130,
      enableEditing: false,
      Cell: ({ cell }) => (
        <Box component="span" sx={{ color: "success.main" }}>
          {formatCurrency(cell.getValue())}
        </Box>
      ),
    },
  ];
}
