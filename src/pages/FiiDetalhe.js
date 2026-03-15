import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FIIService from "../services/fii.service";

function formatValue(value, format) {
  if (value === null || value === undefined) return "—";
  if (format === "currency")
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  if (format === "percent") return `${Number(value).toFixed(2)}%`;
  if (format === "number") return Number(value).toFixed(2);
  return value;
}

const INDICATOR_GROUPS = [
  {
    title: "Dividendos",
    fields: [
      { label: "DY", key: "dy", format: "percent" },
      { label: "Último Dividendo", key: "lastdividend", format: "currency" },
      { label: "CAGR Dividendo", key: "dividend_cagr", format: "percent" },
    ],
  },
  {
    title: "Valuation",
    fields: [
      { label: "P/VP", key: "p_vp", format: "number" },
      { label: "VPA", key: "valorpatrimonialcota", format: "currency" },
    ],
  },
  {
    title: "Fundo",
    fields: [
      { label: "Gestão", key: "gestao_f", format: "text" },
      { label: "Segmento", key: "segment", format: "text" },
      { label: "Liquidez Média Diária", key: "liquidezmediadiaria", format: "number" },
    ],
  },
  {
    title: "Patrimônio",
    fields: [
      { label: "Patrimônio", key: "patrimonio", format: "currency" },
      { label: "Nº Cotistas", key: "numerocotistas", format: "number" },
      { label: "Nº Cotas", key: "numerocotas", format: "number" },
      { label: "% Caixa", key: "percentualcaixa", format: "percent" },
    ],
  },
  {
    title: "Crescimento",
    fields: [
      { label: "CAGR Dividendo", key: "dividend_cagr", format: "percent" },
      { label: "CAGR Cota", key: "cota_cagr", format: "percent" },
    ],
  },
];

function IndicatorCard({ title, fields, fii }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardHeader
          title={title}
          titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
        />
        <CardContent sx={{ pt: 0 }}>
          <Table size="small">
            <TableBody>
              {fields.map(({ label, key, format }) => (
                <TableRow key={key + label}>
                  <TableCell sx={{ color: "text.secondary", border: 0, pl: 0 }}>
                    {label}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500, border: 0, pr: 0 }}>
                    {formatValue(fii[key], format)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Grid>
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

const FiiDetalhe = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [fii, setFii] = useState(null);
  const [favorite, setFavorite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fiiData, favoritesData] = await Promise.all([
          FIIService.getFii(ticker),
          FIIService.getFavorites(),
        ]);
        setFii(fiiData);
        const fav = favoritesData.find(
          (f) => f.fii?.ticker === ticker.toUpperCase()
        );
        setFavorite(fav || null);
      } catch {
        setError("FII não encontrado ou erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ticker]);

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
        onClick={() => navigate("/listaFiis")}
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>

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
          <Typography variant="h4" fontWeight={700}>
            {fii.ticker}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {fii.companyname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {fii.sectorname} • {fii.segment}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h4" fontWeight={700}>
            {fii.price?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }) ?? "—"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cotação atual
          </Typography>
        </Box>
      </Box>

      {favorite && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FavoriteTargetsCard favorite={favorite} price={fii.price} />
          </Grid>
        </Grid>
      )}

      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Indicadores
      </Typography>
      <Grid container spacing={2}>
        {INDICATOR_GROUPS.map((group) => (
          <IndicatorCard
            key={group.title}
            title={group.title}
            fields={group.fields}
            fii={fii}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default FiiDetalhe;
