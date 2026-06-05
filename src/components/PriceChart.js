import React, { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries, HistogramSeries } from "lightweight-charts";
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

function PriceChart({ ticker, initialDays = 90 }) {
  const chartContainerRef = useRef(null);
  const [days, setDays] = useState(initialDays);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    StockService.getPriceHistory(ticker, days)
      .then((response) => {
        if (!cancelled) {
          setData(response.data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Erro ao carregar histórico de preços.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [ticker, days]);

  useEffect(() => {
    if (!data || !chartContainerRef.current || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 320,
      layout: {
        background: { color: "#1a1a2e" },
        textColor: "#c9d1d9",
      },
      grid: {
        vertLines: { color: "#2d2d3f" },
        horzLines: { color: "#2d2d3f" },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "#2d2d3f" },
      timeScale: { borderColor: "#2d2d3f", timeVisible: true },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    candleSeries.setData(
      data.map((d) => ({
        time: d.date,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
    );

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    volumeSeries.setData(
      data.map((d) => ({
        time: d.date,
        value: d.volume,
        color: d.close >= d.open ? "#26a69a55" : "#ef535055",
      }))
    );

    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data]);

  const isEmpty = !loading && !error && data && data.length === 0;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Histórico de Preços
          </Typography>
          <ToggleButtonGroup
            value={days}
            exclusive
            onChange={(_, newDays) => {
              if (newDays !== null) setDays(newDays);
            }}
            size="small"
          >
            {PERIODS.map(({ label, days: d }) => (
              <ToggleButton key={label} value={d} sx={{ px: 1.5, py: 0.5 }}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ my: 1 }}>
            {error}
          </Alert>
        )}

        {isEmpty && (
          <Alert severity="info" sx={{ my: 1 }}>
            Nenhum dado histórico disponível para este período.
          </Alert>
        )}

        <Box
          ref={chartContainerRef}
          sx={{ width: "100%", display: loading || error || isEmpty ? "none" : "block" }}
        />
      </CardContent>
    </Card>
  );
}

export default PriceChart;
