import React from "react";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import DonutChart, { buildSectors } from "../ConcentrationChart";

const CONCENTRATION_THRESHOLD = 40;

function ConcentrationTab({ positions, fiiPositions }) {
  const stockSectors = buildSectors(positions);
  const fiiSectors = buildSectors(fiiPositions);

  const stockAlerts = stockSectors.filter((s) => s.pct > CONCENTRATION_THRESHOLD);
  const fiiAlerts = fiiSectors.filter((s) => s.pct > CONCENTRATION_THRESHOLD);

  const hasData = positions.length > 0 || fiiPositions.length > 0;

  if (!hasData) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          Adicione posições para ver a análise de concentração.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {(stockAlerts.length > 0 || fiiAlerts.length > 0) && (
        <Card
          variant="outlined"
          sx={{ mb: 2, borderColor: "error.main", bgcolor: "error.50" }}
        >
          <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Typography variant="body2" fontWeight={700} color="error.main" sx={{ mb: 0.5 }}>
              ⚠ Concentração excessiva (&gt;{CONCENTRATION_THRESHOLD}%)
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {stockAlerts.map((s) => (
                <Chip
                  key={`stock-${s.name}`}
                  label={`Ações / ${s.name}: ${s.pct.toFixed(1)}%`}
                  color="error"
                  size="small"
                />
              ))}
              {fiiAlerts.map((s) => (
                <Chip
                  key={`fii-${s.name}`}
                  label={`FIIs / ${s.name}: ${s.pct.toFixed(1)}%`}
                  color="error"
                  size="small"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {stockSectors.length > 0 && (
          <Card variant="outlined" sx={{ flex: 1, minWidth: 280 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Ações — por setor
              </Typography>
              <DonutChart sectors={stockSectors} totalLabel="Ações" />
            </CardContent>
          </Card>
        )}

        {fiiSectors.length > 0 && (
          <Card variant="outlined" sx={{ flex: 1, minWidth: 280 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                FIIs — por segmento
              </Typography>
              <DonutChart sectors={fiiSectors} totalLabel="FIIs" />
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default ConcentrationTab;
