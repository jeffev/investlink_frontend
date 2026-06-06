import React from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { formatCurrency, formatPercent } from "../../utils/portfolioFormatters";

const SummaryCards = ({ summary, projectedMonthly }) => {
  const cards = [
    { label: "Total Investido (Ações)", value: formatCurrency(summary?.total_invested) },
    { label: "Valor Atual (Ações)", value: formatCurrency(summary?.current_value) },
    { label: "Resultado Total", value: formatCurrency(summary?.total_pnl) },
    { label: "Rentabilidade", value: formatPercent(summary?.total_pnl_percent) },
    {
      label: "Renda Mensal Projetada",
      value: formatCurrency(projectedMonthly),
      color: "success.main",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {cards.map((card) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={card.label === "Renda Mensal Projetada" ? 4 : 3}
          key={card.label}
        >
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
              <Typography variant="h6" sx={{ color: card.color || "inherit" }}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
