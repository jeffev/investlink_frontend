import React from "react";
import { Box } from "@mui/material";

import { formatBRL, formatPercent as percent } from "./formatters";

/**
 * O que a carteira precisa além da formatação comum.
 *
 * `formatCurrency` e `formatPercent` eram cópias byte a byte do que hoje vive
 * em `formatters.js`; ficam aqui só como nome que o resto da carteira já usa.
 */

export const formatCurrency = formatBRL;

export const formatPercent = percent;

/**
 * Resultado com o sinal traduzido em cor — verde ganhando, vermelho perdendo.
 * É a única parte daqui que não é formatação pura.
 */
export const PnlCell = ({ value, formatter }) => (
  <Box component="span" sx={{ color: value >= 0 ? "success.main" : "error.main" }}>
    {formatter(value)}
  </Box>
);
