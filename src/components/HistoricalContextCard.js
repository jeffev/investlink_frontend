import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { formatNumber } from "../utils/formatters";

/**
 * Where a company trades today against its own past, not against the market.
 *
 * A P/L of 8 says nothing on its own. A P/L of 8 for a company whose own
 * five-year median is 12.6 says the market is pricing it below its own norm —
 * which is the question an investor actually asks, and the one a table of
 * current multiples cannot answer.
 */

const VERDICT_COLOR = {
  BARATO: "success",
  CARO: "error",
  EM_LINHA: "default",
};

const VERDICT_LABEL = {
  BARATO: "Barato vs. histórico",
  CARO: "Caro vs. histórico",
  EM_LINHA: "Em linha",
};

/**
 * Where the current value sits inside the min-max range the company has
 * actually traded at. The bar is the range; the marker is today.
 */
function RangeBar({ indicator }) {
  const { min, max, current } = indicator;
  if (min == null || max == null || max <= min) return null;

  const position = Math.min(
    100,
    Math.max(0, ((current - min) / (max - min)) * 100)
  );

  return (
    <Box sx={{ position: "relative", mt: 0.75, mb: 0.25 }}>
      <LinearProgress
        variant="determinate"
        value={100}
        sx={{
          height: 6,
          borderRadius: 3,
          "& .MuiLinearProgress-bar": { backgroundColor: "action.selected" },
        }}
      />
      <Tooltip title={`Hoje: ${formatNumber(current)}`}>
        <Box
          sx={{
            position: "absolute",
            top: -2,
            left: `${position}%`,
            width: 3,
            height: 10,
            borderRadius: 1,
            backgroundColor: "primary.main",
            transform: "translateX(-1px)",
          }}
        />
      </Tooltip>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.25 }}>
        <Typography variant="caption" color="text.secondary">
          {formatNumber(min)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatNumber(max)}
        </Typography>
      </Box>
    </Box>
  );
}

function IndicatorRow({ indicator }) {
  const direction = indicator.deviation_percent < 0 ? "abaixo" : "acima";
  const magnitude = Math.abs(indicator.deviation_percent).toFixed(0);
  const years = indicator.years?.length ?? 0;

  return (
    <Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="body2" fontWeight={600}>
          {indicator.label} {formatNumber(indicator.current)}
        </Typography>
        <Chip
          label={VERDICT_LABEL[indicator.verdict] || indicator.verdict}
          size="small"
          color={VERDICT_COLOR[indicator.verdict] || "default"}
          variant="outlined"
        />
      </Box>
      <Typography variant="caption" color="text.secondary">
        {magnitude}% {direction} da mediana de {years} anos da própria empresa (
        {formatNumber(indicator.median)})
      </Typography>
      <RangeBar indicator={indicator} />
    </Box>
  );
}

export default function HistoricalContextCard({ context, loading }) {
  const indicators = context?.indicators || [];

  if (!loading && indicators.length === 0) return null;

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardHeader
        title="Contra o próprio histórico"
        subheader="Múltiplos de hoje frente à mediana dos exercícios fechados"
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
        subheaderTypographyProps={{ variant: "caption" }}
      />
      <CardContent sx={{ pt: 0 }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Carregando…
          </Typography>
        ) : (
          <Stack spacing={2}>
            {indicators.map((indicator) => (
              <IndicatorRow key={indicator.key} indicator={indicator} />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
