import React from "react";
import { Box, Card, CardContent, Chip, Tooltip, Typography } from "@mui/material";

const fmt = (v) =>
  v != null ? `${Number(v).toFixed(2)}%` : "—";

function BenchmarkItem({ label, value, portfolioPct, tooltip }) {
  const diff = portfolioPct != null && value != null ? portfolioPct - value : null;
  const isOver = diff != null && diff >= 0;
  const chipColor = diff == null ? "default" : isOver ? "success" : "error";
  const chipLabel =
    diff == null ? "—" : `${diff >= 0 ? "+" : ""}${diff.toFixed(2)}pp`;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
      <Tooltip title={tooltip || ""} placement="top">
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 70 }}>
          {label}
        </Typography>
      </Tooltip>
      <Typography variant="body2" fontWeight={600}>
        {fmt(value)}
      </Typography>
      {portfolioPct != null && (
        <Chip label={chipLabel} color={chipColor} size="small" />
      )}
    </Box>
  );
}

export default function BenchmarkBar({ benchmarks, portfolioPct }) {
  if (!benchmarks) return null;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
            vs Benchmarks (12m):
          </Typography>
          <BenchmarkItem
            label="CDI"
            value={benchmarks.cdi_12m}
            portfolioPct={portfolioPct}
            tooltip="CDI acumulado nos últimos 12 meses (BCB série 12)"
          />
          <BenchmarkItem
            label="IPCA"
            value={benchmarks.ipca_12m}
            portfolioPct={portfolioPct}
            tooltip="IPCA acumulado nos últimos 12 meses (BCB série 433)"
          />
          {benchmarks.stale && (
            <Typography variant="caption" color="text.disabled">
              (dados em cache)
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
