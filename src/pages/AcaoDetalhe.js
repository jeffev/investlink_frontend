import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StockService from "../services/stock.service";
import PriceChart from "../components/PriceChart";
import ScoreChip from "../components/ScoreChip";
import HistoricalContextCard from "../components/HistoricalContextCard";
import IndicatorCard, {
  INDICATOR_GROUPS,
} from "../components/Acao/IndicatorCard";
import MLPredictionCard from "../components/Acao/MLPredictionCard";
import FavoriteTargetsCard from "../components/Acao/FavoriteTargetsCard";
import { computeCeilingPrices } from "../utils/ceilingPrices";
import { getMlChipColor } from "../utils/mlLabels";
import { asList } from "../utils/apiShapes";
import { PageContainer } from "../components/Common/PageLayout";

const AcaoDetalhe = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [stockRaw, setStockRaw] = useState(null);
  const [favorite, setFavorite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [context, setContext] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockData, favoritesData] = await Promise.all([
          StockService.getStock(ticker),
          StockService.getFavorites(),
        ]);
        setStockRaw(stockData);
        const fav = asList(favoritesData).find(
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

  useEffect(() => {
    // Loaded apart from the main fetch: the company's own history is a bonus
    // on top of the page, never a reason for it not to render.
    setLoadingContext(true);
    StockService.getHistoricalContext(ticker)
      .then(setContext)
      .catch(() => setContext(null))
      .finally(() => setLoadingContext(false));
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
    <PageContainer width="default">
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
              <>
                <Chip label={stock.ml_label} color={getMlChipColor(stock.ml_label)} />
                <ScoreChip
                  score={stock.ml_score}
                  label={stock.ml_label}
                  probabilities={{
                    barata: stock.ml_prob_barata,
                    neutra: stock.ml_prob_neutra,
                    cara: stock.ml_prob_cara,
                  }}
                  size="medium"
                />
              </>
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
        <Grid item xs={12} md={4}>
          <HistoricalContextCard context={context} loading={loadingContext} />
        </Grid>
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
    </PageContainer>
  );
};

export default AcaoDetalhe;
