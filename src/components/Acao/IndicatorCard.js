import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

import { formatValue } from "../../utils/formatters";

// Os grupos são dados, não código: acrescentar um indicador é acrescentar uma
// linha aqui, sem tocar no componente que os desenha.
export const INDICATOR_GROUPS = [
  {
    title: "Valuation",
    fields: [
      { label: "P/L", key: "p_l", format: "number" },
      { label: "P/VP", key: "p_vp", format: "number" },
      { label: "P/EBIT", key: "p_ebit", format: "number" },
      { label: "P/Receita", key: "p_sr", format: "number" },
      { label: "EV/EBIT", key: "ev_ebit", format: "number" },
      { label: "P/Ativo", key: "p_ativo", format: "number" },
    ],
  },
  {
    title: "Rentabilidade",
    fields: [
      { label: "ROE", key: "roe", format: "percent" },
      { label: "ROIC", key: "roic", format: "percent" },
      { label: "ROA", key: "roa", format: "percent" },
      { label: "Margem Bruta", key: "margembruta", format: "percent" },
      { label: "Margem EBIT", key: "margemebit", format: "percent" },
      { label: "Margem Líquida", key: "margemliquida", format: "percent" },
    ],
  },
  {
    title: "Dividendos",
    fields: [
      { label: "Dividend Yield", key: "dy", format: "percent" },
    ],
  },
  {
    title: "Crescimento",
    fields: [
      { label: "CAGR Receita 5a", key: "receitas_cagr5", format: "percent" },
    ],
  },
  {
    title: "Dívida",
    fields: [
      { label: "Dív/PL", key: "dividaliquidapatrimonioliquido", format: "number" },
      { label: "Dív/EBIT", key: "dividaliquidaebit", format: "number" },
    ],
  },
  {
    title: "Graham",
    fields: [
      { label: "Preço Graham", key: "graham_formula", format: "currency" },
      {
        label: "Desconto Graham",
        key: "discount_to_graham",
        format: "percent",
        colorBySign: true,
        positiveIsGood: false,
      },
      { label: "VPA", key: "vpa", format: "currency" },
      { label: "LPA", key: "lpa", format: "currency" },
    ],
  },
  {
    title: "Preço Teto",
    subtitle: "Bazin: DY÷6%  |  Gordon: k=12%, g=CAGR Receita",
    fields: [
      { label: "Teto Bazin", key: "bazin_teto", format: "currency" },
      { label: "Desconto Bazin", key: "bazin_discount", format: "percent", colorBySign: true },
      { label: "Teto Gordon", key: "gordon_teto", format: "currency" },
      { label: "Desconto Gordon", key: "gordon_discount", format: "percent", colorBySign: true },
    ],
  },
];

export default function IndicatorCard({ title, subtitle, fields, stock }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardHeader
          title={title}
          subheader={subtitle}
          titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
          subheaderTypographyProps={{ variant: "caption" }}
        />
        <CardContent sx={{ pt: 0 }}>
          <Table size="small">
            <TableBody>
              {fields.map(
                ({ label, key, format, colorBySign, positiveIsGood = true }) => {
                  const val = stock[key];
                  let color = "inherit";
                  if (colorBySign && val != null) {
                    // Bazin and Gordon express "how far below the ceiling"
                    // (positive = cheap), while the Graham field expresses a
                    // premium over fair value (positive = expensive).
                    const isGood = positiveIsGood ? val >= 0 : val < 0;
                    color = isGood ? "success.main" : "error.main";
                  }
                  return (
                    <TableRow key={key}>
                      <TableCell sx={{ color: "text.secondary", border: 0, pl: 0 }}>
                        {label}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 500, border: 0, pr: 0, color }}
                      >
                        {formatValue(val, format)}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Grid>
  );
}
