import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
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

const CARD_COUNT = 12;
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
        assetType
      );
      setOpportunities(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as oportunidades.");
    } finally {
      setLoading(false);
    }
  }, [profile, profilesLoaded, assetType]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

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

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Oportunidades"
        description={`${asset.intro} Ponto de partida para a sua análise — não é recomendação de compra.`}
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
    </PageContainer>
  );
}

export default Oportunidades;
