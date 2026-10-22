import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import StockService from "../services/stock.service";
import PortfolioService from "../services/portfolio.service";
import BenchmarkBar from "../components/BenchmarkBar";
import { formatBRL } from "../utils/formatters";
import { asList } from "../utils/apiShapes";
import { PageContainer } from "../components/Common/PageLayout";
import ScoreMeter from "../components/ScoreMeter";

function getMlChipColor(label) {
  if (label === "BARATA") return "success";
  if (label === "CARA") return "error";
  if (label === "NEUTRA") return "warning";
  return "default";
}

function SummaryCard({ label, value, color }) {
  return (
    <Grid item xs={6} sm={3}>
      <Card variant="outlined">
        <CardContent sx={{ py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ color: color || "inherit" }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function PortfolioCard({ summary, projectedMonthly }) {
  return (
    <Card variant="outlined">
      <CardHeader
        title="Meu Portfólio"
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
        action={
          <Button component={Link} to="/portfolio" size="small">
            Ver tudo
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Grid container spacing={1}>
          <SummaryCard label="Investido" value={formatBRL(summary.total_invested)} />
          <SummaryCard label="Valor Atual" value={formatBRL(summary.current_value)} />
          <SummaryCard
            label="Resultado"
            value={formatBRL(summary.total_pnl)}
            color={summary.total_pnl >= 0 ? "success.main" : "error.main"}
          />
          <SummaryCard
            label="Rentabilidade"
            value={
              summary.total_pnl_percent != null
                ? `${summary.total_pnl_percent.toFixed(2)}%`
                : "—"
            }
            color={summary.total_pnl_percent >= 0 ? "success.main" : "error.main"}
          />
          {projectedMonthly != null && (
            <SummaryCard
              label="Renda Mensal Projetada"
              value={formatBRL(projectedMonthly)}
              color="success.main"
            />
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

function FavoritasCard({ favorites, loading }) {
  return (
    <Card variant="outlined">
      <CardHeader
        title="Minhas Favoritas"
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
        action={
          <Button component={Link} to="/favoritas" size="small">
            Ver todas
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {loading ? (
          <CircularProgress size={24} />
        ) : favorites.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Nenhuma favorita adicionada.
          </Typography>
        ) : (
          <List dense disablePadding>
            {favorites.slice(0, 5).map((fav) => (
              <ListItem
                key={fav.stock?.ticker}
                disableGutters
                secondaryAction={
                  fav.stock?.ml_label && (
                    <Chip
                      label={fav.stock.ml_label}
                      color={getMlChipColor(fav.stock.ml_label)}
                      size="small"
                    />
                  )
                }
              >
                <ListItemText
                  primary={
                    <Box
                      component={Link}
                      to={`/acao/${fav.stock?.ticker}`}
                      sx={{ textDecoration: "none", color: "inherit", fontWeight: 600 }}
                    >
                      {fav.stock?.ticker}
                    </Box>
                  }
                  secondary={formatBRL(fav.stock?.price)}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

function AlertasCard({ alerts, loading }) {
  return (
    <Card variant="outlined">
      <CardHeader
        title="Alertas de Preço"
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
        action={
          <Button component={Link} to="/favoritas" size="small">
            Ver favoritas
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {loading ? (
          <CircularProgress size={24} />
        ) : alerts.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Nenhum alerta ativo no momento.
          </Typography>
        ) : (
          <List dense disablePadding>
            {alerts.map((alert) => (
              <ListItem
                key={alert.ticker}
                disableGutters
                secondaryAction={
                  alert.discount_to_ceiling_percent != null && (
                    <Chip
                      label={`-${alert.discount_to_ceiling_percent.toFixed(1)}%`}
                      color="success"
                      size="small"
                    />
                  )
                }
              >
                <ListItemText
                  primary={
                    <Box
                      component={Link}
                      to={`/acao/${alert.ticker}`}
                      sx={{
                        textDecoration: "none",
                        color: "inherit",
                        fontWeight: 600,
                      }}
                    >
                      {alert.ticker}
                    </Box>
                  }
                  secondary={`${formatBRL(alert.current_price)} ≤ teto ${formatBRL(alert.ceiling_price)}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

function TopPicksCard({ picks, loading }) {
  return (
    <Card variant="outlined">
      <CardHeader
        title="Top Picks ML (BARATA)"
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
        action={
          <Button component={Link} to="/listaAcoes" size="small">
            Ver todas
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {loading ? (
          <CircularProgress size={24} />
        ) : picks.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Sem previsões disponíveis.
          </Typography>
        ) : (
          <List dense disablePadding>
            {picks.map((pick) => (
              <ListItem
                key={pick.ticker}
                disableGutters
                secondaryAction={
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Score: {pick.composite_score ?? "—"}
                  </Typography>
                }
              >
                <ListItemText
                  primary={
                    <Box
                      component={Link}
                      to={`/acao/${pick.ticker}`}
                      sx={{ textDecoration: "none", color: "inherit", fontWeight: 600 }}
                    >
                      {pick.ticker}
                    </Box>
                  }
                  secondary={`${(pick.prob_barata * 100).toFixed(1)}% prob. barata`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

function OportunidadesCard({ opportunities, loading }) {
  return (
    <Card>
      <CardHeader
        title="Oportunidades de hoje"
        subheader="As mais bem pontuadas contra os pares do próprio setor"
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
        subheaderTypographyProps={{ variant: "caption" }}
        action={
          <Button component={Link} to="/oportunidades" size="small">
            Ver todas
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {loading ? (
          <CircularProgress size={24} />
        ) : opportunities.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Nenhuma oportunidade disponível — atualize a base de ações.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 2,
            }}
          >
            {opportunities.map((item) => (
              <Box
                key={item.ticker}
                component={Link}
                to={`/acao/${item.ticker}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <ScoreMeter score={item.score?.score_total} size={44} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>
                    {item.ticker}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {item.sectorname || item.segment || "—"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

const Home = () => {
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [projectedIncome, setProjectedIncome] = useState(null);
  const [benchmarks, setBenchmarks] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [loadingPicks, setLoadingPicks] = useState(true);

  useEffect(() => {
    PortfolioService.getPortfolioSummary()
      .then((data) => {
        if (data.total_invested > 0) setPortfolioSummary(data);
      })
      .catch(() => {})
      .finally(() => setLoadingPortfolio(false));

    PortfolioService.getProjectedIncome()
      .then((data) => setProjectedIncome(data))
      .catch(() => {});

    PortfolioService.getBenchmarks()
      .then((data) => setBenchmarks(data))
      .catch(() => {});

    StockService.getFavorites()
      .then((response) => setFavorites(asList(response)))
      .catch(() => setFavorites([]))
      .finally(() => setLoadingFavorites(false));

    StockService.getAlerts()
      .then(setAlerts)
      .catch(() => setAlerts([]))
      .finally(() => setLoadingAlerts(false));

    StockService.getOpportunities(null, 6)
      .then((response) => setOpportunities(response.data || []))
      .catch(() => setOpportunities([]))
      .finally(() => setLoadingOpportunities(false));

    StockService.getPredictions()
      .then((data) => {
        const picks = (data.data || [])
          .filter((p) => p.label === "BARATA")
          .sort((a, b) => (b.composite_score ?? 0) - (a.composite_score ?? 0))
          .slice(0, 5);
        setTopPicks(picks);
      })
      .catch(() => setTopPicks([]))
      .finally(() => setLoadingPicks(false));
  }, []);

  // suppress unused warning — loading states are managed for future use
  void loadingPortfolio;

  return (
    <PageContainer width="wide">
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <OportunidadesCard
            opportunities={opportunities}
            loading={loadingOpportunities}
          />
        </Grid>
        {(loadingAlerts || alerts.length > 0) && (
          <Grid item xs={12}>
            <AlertasCard alerts={alerts} loading={loadingAlerts} />
          </Grid>
        )}
        {portfolioSummary && (
          <Grid item xs={12}>
            <PortfolioCard
              summary={portfolioSummary}
              projectedMonthly={projectedIncome?.monthly ?? null}
            />
            <BenchmarkBar
              benchmarks={benchmarks}
              portfolioPct={portfolioSummary.total_pnl_percent ?? null}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <FavoritasCard favorites={favorites} loading={loadingFavorites} />
        </Grid>
        {/* Sem previsão no banco, o card só dizia "Sem previsões
            disponíveis" — um card permanente para anunciar ausência. */}
        {(loadingPicks || topPicks.length > 0) && (
        <Grid item xs={12} md={6}>
          <TopPicksCard picks={topPicks} loading={loadingPicks} />
        </Grid>
        )}
      </Grid>
    </PageContainer>
  );
};

export default Home;
