import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";

import { getMlChipColor } from "../../utils/mlLabels";

export default function MLPredictionCard({ stock }) {
  if (!stock.ml_label) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardHeader
          title="Previsão ML"
          titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
        />
        <CardContent>
          <Typography color="text.secondary">Sem previsão disponível</Typography>
        </CardContent>
      </Card>
    );
  }

  const bars = [
    { label: "Barata", value: (stock.ml_prob_barata || 0) * 100, color: "success" },
    { label: "Neutra", value: (stock.ml_prob_neutra || 0) * 100, color: "warning" },
    { label: "Cara", value: (stock.ml_prob_cara || 0) * 100, color: "error" },
  ];

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardHeader
        title="Previsão ML"
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
      />
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Chip label={stock.ml_label} color={getMlChipColor(stock.ml_label)} size="small" />
          <Typography variant="body2" color="text.secondary">
            Score: <strong>{stock.ml_score ?? "—"}/100</strong>
          </Typography>
        </Box>
        {bars.map(({ label, value, color }) => (
          <Box key={label} sx={{ mb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption">{label}</Typography>
              <Typography variant="caption">{value.toFixed(1)}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={value}
              color={color}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
