import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import StockService from "../services/stock.service";
import { formatValue as fmt } from "../utils/formatters";
import MultiPriceChart from "../components/MultiPriceChart";
import { PageContainer } from "../components/Common/PageLayout";

const MAX_TICKERS = 5;

const INDICATORS = [
  { label: "Preço", key: "price", format: "currency", better: null },
  { label: "P/L", key: "p_l", format: "number", better: "min" },
  { label: "P/VP", key: "p_vp", format: "number", better: "min" },
  { label: "EV/EBIT", key: "ev_ebit", format: "number", better: "min" },
  { label: "P/EBIT", key: "p_ebit", format: "number", better: "min" },
  { label: "Dividend Yield", key: "dy", format: "percent", better: "max" },
  { label: "ROE", key: "roe", format: "percent", better: "max" },
  { label: "ROIC", key: "roic", format: "percent", better: "max" },
  { label: "Margem Líquida", key: "margemliquida", format: "percent", better: "max" },
  { label: "Dív/PL", key: "dividaliquidapatrimonioliquido", format: "number", better: "min" },
  { label: "CAGR Receita 5a", key: "receitas_cagr5", format: "percent", better: "max" },
  { label: "Preço Graham", key: "graham_formula", format: "currency", better: null },
  // Negative = price below the Graham value = cheap, so lower is better.
  { label: "Desconto Graham", key: "discount_to_graham", format: "percent", better: "min" },
  { label: "Magic Formula Rank", key: "magic_formula_rank", format: "number", better: "min" },
];

function getBestIndex(stocks, key, better) {
  if (better === null) return -1;
  const values = stocks.map((s) => (s[key] != null ? Number(s[key]) : null));
  const valid = values.filter((v) => v !== null);
  if (valid.length < 2) return -1;
  const best = better === "min" ? Math.min(...valid) : Math.max(...valid);
  return values.findIndex((v) => v === best);
}

export default function Comparar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTickers, setSelectedTickers] = useState(() => {
    const t = searchParams.get("tickers");
    return t ? t.split(",").filter(Boolean) : [];
  });
  const [allTickers, setAllTickers] = useState([]);
  const [stocksData, setStocksData] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Load all tickers for autocomplete
  useEffect(() => {
    StockService.getAllStocks({ pageSize: 500 })
      .then((res) => {
        const options = (res.data || []).map((s) => ({
          ticker: s.ticker,
          label: `${s.ticker} — ${s.companyname || ""}`,
        }));
        setAllTickers(options);
      })
      .catch(() => {})
      .finally(() => setLoadingAll(false));
  }, []);

  // Fetch comparison data when selected tickers change
  useEffect(() => {
    if (selectedTickers.length === 0) {
      setStocksData([]);
      return;
    }
    setLoadingComparison(true);
    StockService.getBulkStocks(selectedTickers)
      .then((data) => {
        // Preserve order of selectedTickers
        const ordered = selectedTickers
          .map((t) => (data || []).find((s) => s.ticker === t))
          .filter(Boolean);
        setStocksData(ordered);
      })
      .catch(() => setStocksData([]))
      .finally(() => setLoadingComparison(false));
  }, [selectedTickers]);

  // Keep URL in sync
  useEffect(() => {
    if (selectedTickers.length > 0) {
      setSearchParams({ tickers: selectedTickers.join(",") }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [selectedTickers, setSearchParams]);

  const addTicker = (ticker) => {
    if (!ticker || selectedTickers.includes(ticker) || selectedTickers.length >= MAX_TICKERS) return;
    setSelectedTickers((prev) => [...prev, ticker]);
  };

  const removeTicker = (ticker) => {
    setSelectedTickers((prev) => prev.filter((t) => t !== ticker));
  };

  const autocompleteOptions = useMemo(
    () => allTickers.filter((o) => !selectedTickers.includes(o.ticker)),
    [allTickers, selectedTickers]
  );

  return (
    <PageContainer width="default">
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Comparar Ativos
      </Typography>

      {/* Seletor */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
            <Autocomplete
              options={autocompleteOptions}
              getOptionLabel={(o) => o.label}
              loading={loadingAll}
              disabled={selectedTickers.length >= MAX_TICKERS}
              onChange={(_, option) => {
                if (option) {
                  addTicker(option.ticker);
                  setInputValue("");
                }
              }}
              value={null}
              inputValue={inputValue}
              onInputChange={(_, newValue) => setInputValue(newValue)}
              sx={{ minWidth: 280 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    selectedTickers.length >= MAX_TICKERS
                      ? "Máximo de 5 ativos atingido"
                      : "Buscar ticker ou empresa..."
                  }
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingAll && <CircularProgress size={16} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              {selectedTickers.map((t) => (
                <Chip key={t} label={t} onDelete={() => removeTicker(t)} color="primary" />
              ))}
              {selectedTickers.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Selecione até {MAX_TICKERS} ativos para comparar.
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Gráfico */}
      {selectedTickers.length >= 2 && (
        <MultiPriceChart tickers={selectedTickers} initialDays={90} />
      )}

      {/* Tabela comparativa */}
      {selectedTickers.length > 0 && (
        <Card variant="outlined">
          <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
            {loadingComparison ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Indicador</TableCell>
                    {stocksData.map((s) => (
                      <TableCell key={s.ticker} align="right" sx={{ fontWeight: 700 }}>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{s.ticker}</Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {s.companyname}
                          </Typography>
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {INDICATORS.map((ind) => {
                    const bestIdx = getBestIndex(stocksData, ind.key, ind.better);
                    return (
                      <TableRow key={ind.key} hover>
                        <TableCell sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                          {ind.label}
                        </TableCell>
                        {stocksData.map((s, i) => {
                          const isBest = i === bestIdx;
                          return (
                            <TableCell
                              key={s.ticker}
                              align="right"
                              sx={{
                                fontWeight: isBest ? 700 : 400,
                                color: isBest ? "success.main" : "inherit",
                              }}
                            >
                              {fmt(s[ind.key], ind.format)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
