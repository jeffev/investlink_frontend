import React, { useEffect, useRef, useState } from "react";
import { createChart, LineSeries } from "lightweight-charts";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BacktestService from "../services/backtest.service";

const PERIODS = [
  { label: "1A", years: 1 },
  { label: "2A", years: 2 },
  { label: "3A", years: 3 },
  { label: "5A", years: 5 },
];

function periodToStartDate(years) {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().split("T")[0];
}

function MetricCard({ label, value, color }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 120,
        textAlign: "center",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 1.5,
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={700} color={color || "text.primary"}>
        {value}
      </Typography>
    </Box>
  );
}

function BacktestModal({ open, strategy, onClose }) {
  const [period, setPeriod] = useState("1A");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!open || !strategy) return;
    setResult(null);
    setError(null);
    setLoading(true);
    const years = PERIODS.find((p) => p.label === period)?.years || 1;
    const startDate = periodToStartDate(years);
    BacktestService.runBacktest(strategy.id, startDate)
      .then((data) => setResult(data))
      .catch((err) => {
        const msg = err?.response?.data?.message || "Erro ao executar backtest.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [open, strategy, period]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!result || !chartRef.current || loading) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 260,
      layout: { background: { color: "#1a1a2e" }, textColor: "#c9d1d9" },
      grid: { vertLines: { color: "#2d2d3f" }, horzLines: { color: "#2d2d3f" } },
      rightPriceScale: { borderColor: "#2d2d3f" },
      timeScale: { borderColor: "#2d2d3f", timeVisible: false },
    });

    const portfolioSeries = chart.addSeries(LineSeries, {
      color: "#2196f3",
      lineWidth: 2,
      title: "Portfólio",
    });
    portfolioSeries.setData(
      result.portfolio_series.map((p) => ({ time: p.date, value: p.value }))
    );

    const hasCdi =
      result.cdi_series &&
      result.cdi_series.length > 0 &&
      result.cdi_series[0].value != null;
    if (hasCdi) {
      const cdiSeries = chart.addSeries(LineSeries, {
        color: "#ff9800",
        lineWidth: 1,
        lineStyle: 2,
        title: "CDI",
      });
      cdiSeries.setData(
        result.cdi_series.map((p) => ({ time: p.date, value: p.value }))
      );
    }

    chart.timeScale().fitContent();
    chartInstanceRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (chartRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartRef.current.clientWidth,
        });
      }
    });
    ro.observe(chartRef.current);

    return () => {
      ro.disconnect();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [result, loading]);

  const metrics = result?.metrics;

  const fmt = (v, suffix = "%") =>
    v != null ? `${v > 0 ? "+" : ""}${v}${suffix}` : "—";
  const fmtColor = (v) => (v == null ? undefined : v >= 0 ? "success.main" : "error.main");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Backtest — {strategy?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Baseado nos filtros atuais aplicados sobre dados fundamentais de hoje
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Período:
          </Typography>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(_, v) => { if (v) setPeriod(v); }}
            size="small"
          >
            {PERIODS.map(({ label }) => (
              <ToggleButton key={label} value={label} sx={{ px: 2, py: 0.5 }}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && result && (
          <>
            {/* Legenda */}
            <Box sx={{ display: "flex", gap: 2, mb: 1, alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 16, height: 3, bgcolor: "#2196f3", borderRadius: 1 }} />
                <Typography variant="caption" fontWeight={600}>Portfólio</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 16, height: 2, bgcolor: "#ff9800", borderRadius: 1 }} />
                <Typography variant="caption" fontWeight={600}>CDI</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                {result.start_date} → {result.end_date} · {result.metrics.ticker_count} ativos
              </Typography>
            </Box>

            <Box ref={chartRef} sx={{ width: "100%", mb: 2 }} />

            {/* Métricas */}
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 2 }}>
              <MetricCard
                label="Retorno Total"
                value={fmt(metrics.total_return)}
                color={fmtColor(metrics.total_return)}
              />
              <MetricCard
                label="CAGR"
                value={fmt(metrics.cagr)}
                color={fmtColor(metrics.cagr)}
              />
              <MetricCard
                label="CDI (período)"
                value={fmt(metrics.cdi_total_return)}
                color="text.secondary"
              />
              <MetricCard
                label="Drawdown Máx."
                value={fmt(metrics.max_drawdown)}
                color={metrics.max_drawdown != null && metrics.max_drawdown < 0 ? "error.main" : undefined}
              />
            </Box>

            {(metrics.best_ticker || metrics.worst_ticker) && (
              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                {metrics.best_ticker && (
                  <Tooltip title="Melhor desempenho">
                    <Chip
                      label={`▲ ${metrics.best_ticker.ticker} ${fmt(metrics.best_ticker.return)}`}
                      color="success"
                      size="small"
                    />
                  </Tooltip>
                )}
                {metrics.worst_ticker && metrics.worst_ticker.ticker !== metrics.best_ticker?.ticker && (
                  <Tooltip title="Pior desempenho">
                    <Chip
                      label={`▼ ${metrics.worst_ticker.ticker} ${fmt(metrics.worst_ticker.return)}`}
                      color="error"
                      size="small"
                    />
                  </Tooltip>
                )}
              </Box>
            )}

            <Divider sx={{ mb: 1.5 }} />

            {/* Tabela de retornos por ticker */}
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Retorno por ativo no período
            </Typography>
            <Box sx={{ maxHeight: 220, overflow: "auto" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticker</TableCell>
                    <TableCell align="right">Retorno</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.ticker_returns.map((row) => (
                    <TableRow key={row.ticker}>
                      <TableCell>{row.ticker}</TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: row.return >= 0 ? "success.main" : "error.main", fontWeight: 600 }}
                      >
                        {fmt(row.return)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Fechar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default BacktestModal;
