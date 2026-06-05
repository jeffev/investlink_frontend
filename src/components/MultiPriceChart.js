import React, { useEffect, useRef, useState } from "react";
import { createChart, LineSeries } from "lightweight-charts";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import StockService from "../services/stock.service";

const PERIODS = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1A", days: 365 },
  { label: "Tudo", days: 0 },
];

const COLORS = ["#2196f3", "#f44336", "#4caf50", "#ff9800", "#9c27b0"];

function normalize(data) {
  if (!data || data.length === 0) return [];
  const base = data[0].close;
  if (!base) return [];
  return data.map((d) => ({ time: d.date, value: parseFloat(((d.close / base) * 100).toFixed(2)) }));
}

function MultiPriceChart({ tickers, initialDays = 90 }) {
  const chartContainerRef = useRef(null);
  const [days, setDays] = useState(initialDays);
  const [seriesData, setSeriesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tickers || tickers.length === 0) {
      setSeriesData({});
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all(tickers.map((t) => StockService.getPriceHistory(t, days)))
      .then((results) => {
        if (cancelled) return;
        const map = {};
        results.forEach((res, i) => {
          map[tickers[i]] = normalize(res.data || []);
        });
        setSeriesData(map);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Erro ao carregar histórico de preços.");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [tickers, days]);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const hasData = Object.values(seriesData).some((d) => d.length > 0);
    if (!hasData) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 280,
      layout: { background: { color: "#1a1a2e" }, textColor: "#c9d1d9" },
      grid: { vertLines: { color: "#2d2d3f" }, horzLines: { color: "#2d2d3f" } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "#2d2d3f" },
      timeScale: { borderColor: "#2d2d3f", timeVisible: true },
    });

    tickers.forEach((ticker, i) => {
      const data = seriesData[ticker];
      if (!data || data.length === 0) return;
      const series = chart.addSeries(LineSeries, {
        color: COLORS[i % COLORS.length],
        lineWidth: 2,
        title: ticker,
      });
      series.setData(data);
    });

    chart.timeScale().fitContent();

    const ro = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    });
    ro.observe(chartContainerRef.current);

    return () => { ro.disconnect(); chart.remove(); };
  }, [seriesData, tickers]);

  const isEmpty = !loading && !error && Object.values(seriesData).every((d) => d.length === 0);

  if (!tickers || tickers.length === 0) return null;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Desempenho Relativo
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Base 100 — retorno relativo ao ponto inicial
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={days}
            exclusive
            onChange={(_, v) => { if (v !== null) setDays(v); }}
            size="small"
          >
            {PERIODS.map(({ label, days: d }) => (
              <ToggleButton key={label} value={d} sx={{ px: 1.5, py: 0.5 }}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Legenda */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1 }}>
          {tickers.map((ticker, i) => (
            <Box key={ticker} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box sx={{ width: 16, height: 3, borderRadius: 1, bgcolor: COLORS[i % COLORS.length] }} />
              <Typography variant="caption" fontWeight={600}>{ticker}</Typography>
            </Box>
          ))}
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        )}
        {!loading && error && <Alert severity="error" sx={{ my: 1 }}>{error}</Alert>}
        {isEmpty && <Alert severity="info" sx={{ my: 1 }}>Nenhum dado histórico disponível.</Alert>}

        <Box
          ref={chartContainerRef}
          sx={{ width: "100%", display: loading || error || isEmpty ? "none" : "block" }}
        />
      </CardContent>
    </Card>
  );
}

export default MultiPriceChart;
