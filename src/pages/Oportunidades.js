import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  FormControlLabel,
  InputAdornment,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";

import StockService from "../services/stock.service";
import OpportunityCard from "../components/OpportunityCard";
import {
  CardGrid,
  PageContainer,
  PageHeader,
} from "../components/Common/PageLayout";
import ScoreBacktestCard from "../components/ScoreBacktestCard";
import { relativeTime } from "../utils/relativeTime";

const CARD_COUNT = 12;
const MAX_COMPARE = 5;
const PROFILE_STORAGE_KEY = "oportunidadesProfile";
const ASSET_STORAGE_KEY = "oportunidadesAtivo";

const ASSETS = {
  ACAO: {
    label: "Ações",
    intro:
      "As ações mais bem pontuadas contra as do próprio setor, com o argumento a favor e o alerta contra cada uma.",
    emptyText:
      "Nenhuma ação passou pelos filtros de liquidez, endividamento e consistência de lucro neste perfil.",
    tablePath: "/listaAcoes",
    tableLabel: "Ver a tabela completa",
  },
  FII: {
    label: "FIIs",
    intro:
      "Os fundos imobiliários mais bem pontuados contra os do próprio segmento — P/VP, renda, liquidez e estrutura, com o alerta contra cada um.",
    emptyText:
      "Nenhum fundo passou pelo filtro de liquidez neste perfil. O corte é de R$ 200 mil negociados por dia.",
    tablePath: "/listaFiis",
    tableLabel: "Ver a tabela completa de FIIs",
  },
};

function readStored(key, fallback = null) {
  try {
    return sessionStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function store(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // A aba lembrada é conveniência, nunca motivo para a página falhar.
  }
}

function Oportunidades() {
  const [assetType, setAssetType] = useState(readStored(ASSET_STORAGE_KEY, "ACAO"));
  const [profiles, setProfiles] = useState([]);
  const [profile, setProfile] = useState(readStored(PROFILE_STORAGE_KEY));
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilesLoaded, setProfilesLoaded] = useState(false);
  const [backtest, setBacktest] = useState(null);
  const [loadingBacktest, setLoadingBacktest] = useState(false);
  const [backtestError, setBacktestError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  // Os filtros do investidor. Vão para o servidor: a vitrine devolve só os
  // doze melhores, e peneirar isso na tela deixaria três cards.
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyDrawdown, setOnlyDrawdown] = useState(false);
  const [excludePortfolio, setExcludePortfolio] = useState(false);
  // Seleção para o comparador, que existia e vivia desconectado da
  // vitrine: era preciso copiar ticker na mão para usá-lo.
  const [selecionados, setSelecionados] = useState([]);

  const asset = ASSETS[assetType] || ASSETS.ACAO;
  const isFii = assetType === "FII";

  useEffect(() => {
    // Recarregado a cada troca de ativo: CRESCIMENTO existe para ação e não
    // para fundo, então a lista de perfis não é a mesma nos dois.
    setProfilesLoaded(false);
    let cancelled = false;

    StockService.getScoreProfiles(assetType)
      .then((response) => {
        if (cancelled) return;
        const available = response.data || [];
        setProfiles(available);
        setProfile((current) => {
          if (current && available.some((entry) => entry.key === current)) {
            return current;
          }
          return (available.find((entry) => entry.default) || available[0])?.key;
        });
      })
      .catch(() => {
        if (!cancelled) setProfiles([]);
      })
      // Marcado mesmo em caso de erro: sem isto a página ficaria carregando
      // para sempre quando a lista de perfis não responde.
      .finally(() => {
        if (!cancelled) setProfilesLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [assetType]);

  const loadOpportunities = useCallback(async () => {
    // Esperar o perfil evita a busca duplicada do carregamento: sem isto a
    // página pedia a vitrine sem perfil e pedia de novo quando ele chegava.
    if (!profilesLoaded) return;
    setLoading(true);
    setError(null);
    try {
      const response = await StockService.getOpportunities(
        profile,
        CARD_COUNT,
        assetType,
        { maxPrice, onlyDrawdown, excludePortfolio }
      );
      setOpportunities(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as oportunidades.");
    } finally {
      setLoading(false);
    }
  }, [profile, profilesLoaded, assetType, maxPrice, onlyDrawdown, excludePortfolio]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  useEffect(() => {
    // De quando é o preço que está na tela. Sem isso ninguém sabe se a lista
    // é do fechamento de ontem ou de três semanas atrás.
    StockService.getLastRefresh()
      .then(setLastRefresh)
      .catch(() => setLastRefresh(null));
  }, []);

  useEffect(() => {
    // Carregado à parte da vitrine: o backtest percorre anos de histórico e
    // não pode atrasar os cards, que são o motivo da página existir.
    // Só existe para ações: o histórico anual de FII ainda não foi construído,
    // e um backtest sem dado seria um gráfico inventado.
    if (!profilesLoaded || isFii) return;
    setLoadingBacktest(true);
    setBacktestError(null);
    StockService.getScoreBacktest(profile)
      .then(setBacktest)
      .catch(() => setBacktestError("Não foi possível medir o histórico do score."))
      .finally(() => setLoadingBacktest(false));
  }, [profile, profilesLoaded, isFii]);

  const handleProfile = (_, value) => {
    setProfile(value);
    store(PROFILE_STORAGE_KEY, value);
  };

  const handleAsset = (_, value) => {
    setAssetType(value);
    store(ASSET_STORAGE_KEY, value);
  };

  const alternarComparacao = (ticker) =>
    setSelecionados((atual) =>
      atual.includes(ticker)
        ? atual.filter((item) => item !== ticker)
        : // Cinco é o limite do comparador; além disso a tabela deixa de
          // caber na tela e a comparação deixa de comparar.
          [...atual, ticker].slice(0, MAX_COMPARE)
    );

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Oportunidades"
        description={`${asset.intro} Ponto de partida para a sua análise — não é recomendação de compra.`}
        actions={
          lastRefresh?.started_at && (
            <Tooltip
              title={
                lastRefresh.status === "OK"
                  ? "Atualização automática concluída sem falhas"
                  : `Última atualização: ${lastRefresh.status} — ${lastRefresh.detail || ""}`
              }
            >
              <Chip
                size="small"
                variant="outlined"
                color={lastRefresh.status === "OK" ? "default" : "warning"}
                label={`Atualizado ${relativeTime(lastRefresh.started_at)}`}
              />
            </Tooltip>
          )
        }
      />

      {/* Tipo de ativo é o assunto da página; perfil é o peso aplicado a ele.
          Antes eram duas fileiras de abas idênticas, e nada dizia qual mandava
          em qual. */}
      <Tabs
        value={assetType}
        onChange={handleAsset}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2.5 }}
      >
        {Object.entries(ASSETS).map(([key, entry]) => (
          <Tab key={key} value={key} label={entry.label} />
        ))}
      </Tabs>

      {profiles.length > 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ mb: 3 }}
        >
          <Typography variant="body2" color="text.secondary">
            Ordenar por perfil:
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={profile || null}
            onChange={(event, value) => value && handleProfile(event, value)}
            aria-label="Perfil de pesos do score"
          >
            {profiles.map((entry) => (
              <ToggleButton key={entry.key} value={entry.key} sx={{ px: 2 }}>
                {entry.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      )}

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", md: "center" }}
        sx={{ mb: 3 }}
      >
        <TextField
          size="small"
          type="number"
          label="Preço máximo"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          sx={{ width: 170 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
          helperText="A melhor oportunidade que não cabe no bolso não é oportunidade"
        />
        <FormControlLabel
          control={
            <Switch
              checked={onlyDrawdown}
              onChange={(event) => setOnlyDrawdown(event.target.checked)}
            />
          }
          label={
            <Tooltip title="Mostra só o que caiu do topo de 12 meses com o fundamento de pé — queda com lucro caindo junto fica de fora">
              <span>Só quem caiu do topo</span>
            </Tooltip>
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={excludePortfolio}
              onChange={(event) => setExcludePortfolio(event.target.checked)}
            />
          }
          label="Esconder o que já tenho"
        />
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : opportunities.length === 0 ? (
        <Alert severity="info">{asset.emptyText}</Alert>
      ) : (
        <CardGrid minColumnWidth={340}>
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.ticker}
              opportunity={opportunity}
              assetType={assetType}
              selected={selecionados.includes(opportunity.ticker)}
              onToggleCompare={alternarComparacao}
            />
          ))}
        </CardGrid>
      )}

      {!isFii && (
        <ScoreBacktestCard
          backtest={backtest}
          loading={loadingBacktest}
          error={backtestError}
        />
      )}

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Button component={Link} to={asset.tablePath} variant="outlined">
          {asset.tableLabel}
        </Button>
      </Box>

      {selecionados.length > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: "sticky",
            bottom: 16,
            mt: 2,
            p: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Comparando:
          </Typography>
          {selecionados.map((ticker) => (
            <Chip
              key={ticker}
              label={ticker}
              size="small"
              onDelete={() => alternarComparacao(ticker)}
            />
          ))}
          <Box sx={{ flexGrow: 1 }} />
          <Button size="small" onClick={() => setSelecionados([])}>
            Limpar
          </Button>
          <Button
            variant="contained"
            size="small"
            component={Link}
            to={`/comparar?tickers=${selecionados.join(",")}`}
            disabled={selecionados.length < 2}
          >
            Comparar {selecionados.length}
          </Button>
        </Paper>
      )}
    </PageContainer>
  );
}

export default Oportunidades;
