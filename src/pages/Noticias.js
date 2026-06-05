import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import StockService from "../services/stock.service";
import NewsService from "../services/news.service";

const PER_PAGE = 20;

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function NewsCard({ article }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea
        component="a"
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}
      >
        {article.urlToImage && (
          <CardMedia
            component="img"
            image={article.urlToImage}
            alt=""
            sx={{ height: 160, width: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}
        <CardContent sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, gap: 1 }}>
            <Typography variant="caption" color="text.secondary" noWrap>
              {article.source}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {formatDate(article.publishedAt)}
            </Typography>
          </Box>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ lineHeight: 1.4 }}>
            {article.title}
          </Typography>
          {article.description && (
            <Typography variant="body2" color="text.secondary" sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {article.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function Noticias() {
  const [allTickers, setAllTickers] = useState([]);
  const [loadingTickers, setLoadingTickers] = useState(true);
  const [selectedTickers, setSelectedTickers] = useState([]);

  const [articles, setArticles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingNews, setLoadingNews] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    StockService.getAllStocks({ pageSize: 500 })
      .then((res) => {
        const opts = (res.data || []).map((s) => ({
          ticker: s.ticker,
          label: `${s.ticker} — ${s.companyname || ""}`,
        }));
        setAllTickers(opts);
      })
      .catch(() => {})
      .finally(() => setLoadingTickers(false));
  }, []);

  useEffect(() => {
    setLoadingNews(true);
    setError(null);
    NewsService.getNews({ tickers: selectedTickers, page, perPage: PER_PAGE })
      .then((data) => {
        setArticles(data.articles || []);
        setTotalResults(data.total_results || 0);
      })
      .catch(() => setError("Erro ao carregar notícias. Tente novamente."))
      .finally(() => setLoadingNews(false));
  }, [selectedTickers, page]);

  const autocompleteOptions = useMemo(
    () => allTickers.filter((o) => !selectedTickers.includes(o.ticker)),
    [allTickers, selectedTickers]
  );

  const addTicker = (ticker) => {
    if (!ticker || selectedTickers.includes(ticker) || selectedTickers.length >= 5) return;
    setSelectedTickers((prev) => [...prev, ticker]);
    setPage(1);
  };

  const removeTicker = (ticker) => {
    setSelectedTickers((prev) => prev.filter((t) => t !== ticker));
    setPage(1);
  };

  const totalPages = Math.ceil(totalResults / PER_PAGE);

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <NewspaperIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Notícias do Mercado
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {selectedTickers.length === 0
          ? "Exibindo notícias gerais sobre o mercado brasileiro."
          : `Notícias filtradas por: ${selectedTickers.join(", ")}`}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <Autocomplete
          options={autocompleteOptions}
          getOptionLabel={(o) => o.label}
          loading={loadingTickers}
          disabled={selectedTickers.length >= 5}
          onChange={(_, option) => { if (option) addTicker(option.ticker); }}
          value={null}
          inputValue=""
          onInputChange={() => {}}
          sx={{ minWidth: 280 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filtrar por ticker ou empresa..."
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingTickers && <CircularProgress size={16} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", alignItems: "center" }}>
          {selectedTickers.map((t) => (
            <Chip key={t} label={t} onDelete={() => removeTicker(t)} size="small" />
          ))}
        </Box>
      </Box>

      {loadingNews && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loadingNews && error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {!loadingNews && !error && articles.length === 0 && (
        <Alert severity="info">Nenhuma notícia encontrada para os filtros selecionados.</Alert>
      )}

      {!loadingNews && articles.length > 0 && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {articles.map((article, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <NewsCard article={article} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, v) => { setPage(v); window.scrollTo(0, 0); }}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default Noticias;
