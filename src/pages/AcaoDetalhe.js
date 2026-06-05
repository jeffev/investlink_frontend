import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StockService from "../services/stock.service";
import PriceChart from "../components/PriceChart";

function formatValue(value, format) {
  if (value === null || value === undefined) return "—";
  if (format === "currency")
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  if (format === "percent") return `${Number(value).toFixed(2)}%`;
  if (format === "number") return Number(value).toFixed(2);
  return value;
}

function getMlChipColor(label) {
  if (label === "BARATA") return "success";
  if (label === "CARA") return "error";
  if (label === "NEUTRA") return "warning";
  return "default";
}

function computeCeilingPrices(stock) {
  const price = stock?.price;
  const dy = stock?.dy;
  const cagr = stock?.receitas_cagr5;

  if (!price || !dy || dy <= 0) return {};

  const dividendoAnual = price * (dy / 100);
  const bazinTeto = dividendoAnual / 0.06;
  const bazinDiscount =
    bazinTeto > 0 ? ((bazinTeto - price) / bazinTeto) * 100 : null;

  const k = 0.12;
  const g = cagr != null ? Math.min(Math.max(cagr / 100, 0), 0.1) : 0;
  let gordonTeto = null;
  let gordonDiscount = null;
  if (k > g) {
    gordonTeto = dividendoAnual / (k - g);
    gordonDiscount =
      gordonTeto > 0 ? ((gordonTeto - price) / gordonTeto) * 100 : null;
  }

  return {
    bazin_teto: bazinTeto,
    bazin_discount: bazinDiscount,
    gordon_teto: gordonTeto,
    gordon_discount: gordonDiscount,
  };
}

const INDICATOR_GROUPS = [
  {
    title: "Valuation",
    fields: [
      { label: "P/L", key: "p_l", format: "number" },
      { label: "P/VP", key: "p_vp", format: "number" },
      { label: "P/EBIT", key: "p_ebit", format: "number" },
      { label: "P/Receita", key: "p_sr", format: "number" },
      { label: "EV/EBIT", key: "ev_ebit", format: "number" },
      { label: "P/Ativo", key: "p_ativo", format: "number" },
    ],
  },
  {
    title: "Rentabilidade",
    fields: [
      { label: "ROE", key: "roe", format: "percent" },
      { label: "ROIC", key: "roic", format: "percent" },
      { label: "ROA", key: "roa", format: "percent" },
      { label: "Margem Bruta", key: "margembruta", format: "percent" },
      { label: "Margem EBIT", key: "margemebit", format: "percent" },
      { label: "Margem Líquida", key: "margemliquida", format: "percent" },
    ],
  },
  {
    title: "Dividendos",
    fields: [
      { label: "Dividend Yield", key: "dy", format: "percent" },
    ],
  },
  {
    title: "Crescimento",
    fields: [
      { label: "CAGR Receita 5a", key: "receitas_cagr5", format: "percent" },
    ],
  },
  {
    title: "Dívida",
    fields: [
      { label: "Dív/PL", key: "dividaliquidapatrimonioliquido", format: "number" },
      { label: "Dív/EBIT", key: "dividaliquidaebit", format: "number" },
    ],
  },
  {
    title: "Graham",
    fields: [
      { label: "Preço Graham", key: "graham_formula", format: "currency" },
      { label: "Desconto Graham", key: "discount_to_graham", format: "percent", colorBySign: true },
      { label: "VPA", key: "vpa", format: "currency" },
      { label: "LPA", key: "lpa", format: "currency" },
    ],
  },
  {
    title: "Preço Teto",
    subtitle: "Bazin: DY÷6%  |  Gordon: k=12%, g=CAGR Receita",
    fields: [
      { label: "Teto Bazin", key: "bazin_teto", format: "currency" },
      { label: "Desconto Bazin", key: "bazin_discount", format: "percent", colorBySign: true },
      { label: "Teto Gordon", key: "gordon_teto", format: "currency" },
      { label: "Desconto Gordon", key: "gordon_discount", format: "percent", colorBySign: true },
    ],
  },
];

function IndicatorCard({ title, subtitle, fields, stock }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardHeader
          title={title}
          subheader={subtitle}
          titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
          subheaderTypographyProps={{ variant: "caption" }}
        />
        <CardContent sx={{ pt: 0 }}>
          <Table size="small">
            <TableBody>
              {fields.map(({ label, key, format, colorBySign }) => {
                const val = stock[key];
                let color = "inherit";
                if (colorBySign && val != null) {
                  color = val >= 0 ? "success.main" : "error.main";
                }
                return (
                  <TableRow key={key}>
                    <TableCell sx={{ color: "text.secondary", border: 0, pl: 0 }}>
                      {label}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 500, border: 0, pr: 0, color }}
                    >
                      {formatValue(val, format)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Grid>
  );
}

function MLPredictionCard({ stock }) {
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

function FavoriteTargetsCard({ favorite, price }) {
  const { ceiling_price, target_price } = favorite;
  return (
    <Card variant="outlined">
      <CardHeader
        title="Meus Alvos"
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
      />
      <CardContent>
        <Table size="small">
          <TableBody>
            {ceiling_price != null && (
              <TableRow>
                <TableCell sx={{ border: 0, pl: 0, color: "text.secondary" }}>
                  Preço Teto
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    border: 0,
                    pr: 0,
                    fontWeight: 600,
                    color: price <= ceiling_price ? "success.main" : "error.main",
                  }}
                >
                  {ceiling_price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
              </TableRow>
            )}
            {target_price != null && (
              <TableRow>
                <TableCell sx={{ border: 0, pl: 0, color: "text.secondary" }}>
                  Preço Alvo
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    border: 0,
                    pr: 0,
                    fontWeight: 600,
                    color: price <= target_price ? "success.main" : "error.main",
                  }}
                >
                  {target_price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell sx={{ border: 0, pl: 0, color: "text.secondary" }}>
                Cotação Atual
              </TableCell>
              <TableCell align="right" sx={{ border: 0, pr: 0, fontWeight: 700 }}>
                {price?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "—"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const AcaoDetalhe = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [stockRaw, setStockRaw] = useState(null);
  const [favorite, setFavorite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockData, favoritesData] = await Promise.all([
          StockService.getStock(ticker),
          StockService.getFavorites(),
        ]);
        setStockRaw(stockData);
        const fav = favoritesData.find(
          (f) => f.stock?.ticker === ticker.toUpperCase()
        );
        setFavorite(fav || null);
      } catch (err) {
        setError("Ação não encontrada ou erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ticker]);

  const stock = stockRaw ? { ...stockRaw, ...computeCeilingPrices(stockRaw) } : null;

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 2 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/listaAcoes")}
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              {stock.ticker}
            </Typography>
            {stock.ml_label && (
              <Chip label={stock.ml_label} color={getMlChipColor(stock.ml_label)} />
            )}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {stock.companyname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stock.sectorname} • {stock.subsectorname}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h4" fontWeight={700}>
            {stock.price?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }) ?? "—"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cotação atual
          </Typography>
        </Box>
      </Box>

      {/* Price History Chart */}
      <PriceChart ticker={stock.ticker} initialDays={90} />

      {/* ML + Targets row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <MLPredictionCard stock={stock} />
        </Grid>
        {favorite && (
          <Grid item xs={12} md={4}>
            <FavoriteTargetsCard favorite={favorite} price={stock.price} />
          </Grid>
        )}
      </Grid>

      {/* Indicators */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Indicadores Fundamentalistas
      </Typography>
      <Grid container spacing={2}>
        {INDICATOR_GROUPS.map((group) => (
          <IndicatorCard
            key={group.title}
            title={group.title}
            subtitle={group.subtitle}
            fields={group.fields}
            stock={stock}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default AcaoDetalhe;
