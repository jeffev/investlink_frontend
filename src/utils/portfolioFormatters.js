import React from "react";
import { Box } from "@mui/material";

export const formatCurrency = (value) => {
  if (value == null) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const formatPercent = (value) => {
  if (value == null) return "—";
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
};

export const PnlCell = ({ value, formatter }) => (
  <Box component="span" sx={{ color: value >= 0 ? "success.main" : "error.main" }}>
    {formatter(value)}
  </Box>
);
