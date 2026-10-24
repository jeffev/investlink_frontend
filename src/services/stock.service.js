import ApiService from "./api.service";

class StockService extends ApiService {
  async getAllStocks({ page = 1, pageSize = 50, sorting = [], columnFilters = [], search = "", profile = "" } = {}) {
    const params = new URLSearchParams({ page, per_page: pageSize });
    if (profile) {
      params.set("profile", profile);
    }
    if (sorting.length > 0) {
      params.set("sort_by", sorting[0].id);
      params.set("sort_dir", sorting[0].desc ? "desc" : "asc");
    }
    if (columnFilters.length > 0) {
      params.set("filters", JSON.stringify(columnFilters));
    }
    if (search) {
      params.set("search", search);
    }
    return this.request("get", `stocks?${params.toString()}`);
  }

  async addFavorite(stockId) {
    return this.request("post", `favorites/${stockId}`);
  }

  async removeFavorite(stockTicker) {
    return this.request("delete", `favorites/${stockTicker}`);
  }

  async getFavorites(page = 1, perPage = 50) {
    return this.request("get", `favorites?page=${page}&per_page=${perPage}`);
  }

  async editFavorite(favoriteId, newData) {
    return this.request("put", `favorite/${favoriteId}`, newData);
  }

  async updateStocks() {
    return this.request("put", "stocks/update-stocks");
  }

  async getStock(ticker) {
    return this.request("get", `stock/${ticker.toUpperCase()}`);
  }

  async getPredictions() {
    return this.request("get", "stocks/predictions");
  }

  async getAlerts() {
    return this.request("get", "favorites/alerts");
  }

  async getPriceHistory(ticker, days = 90) {
    return this.request("get", `stock/${ticker.toUpperCase()}/history?days=${days}`);
  }

  async getBulkStocks(tickers) {
    return this.request("get", `stocks/bulk?tickers=${tickers.join(",")}`);
  }

  async getOpportunities(profile, limit = 12, assetType, filters = {}) {
    const params = new URLSearchParams({ limit });
    if (profile) params.set("profile", profile);
    // Sem o parâmetro o backend devolve ações, que é o que a tela pedia antes
    // de existir vitrine de FII.
    if (assetType) params.set("asset_type", assetType);

    // Os filtros vão para o servidor, e não são aplicados na lista recebida:
    // o recorte já é "os doze melhores", e peneirar o resultado deixaria três
    // cards em vez de trazer os próximos da fila.
    if (filters.maxPrice) params.set("max_price", filters.maxPrice);
    if (filters.onlyDrawdown) params.set("only_drawdown", "true");
    if (filters.excludePortfolio) params.set("exclude_portfolio", "true");

    return this.request("get", `opportunities?${params.toString()}`);
  }

  async getLastRefresh() {
    return this.request("get", "jobs/last-refresh");
  }

  async getScoreBacktest(profile) {
    const params = profile ? `?profile=${profile}` : "";
    return this.request("get", `opportunities/backtest${params}`);
  }

  async getScoreProfiles(assetType) {
    const params = assetType ? `?asset_type=${assetType}` : "";
    return this.request("get", `opportunities/profiles${params}`);
  }

  async getStockScore(ticker, profile) {
    const params = profile ? `?profile=${profile}` : "";
    return this.request(
      "get",
      `stock/${ticker.toUpperCase()}/score${params}`
    );
  }

  async getHistoricalContext(ticker, years = 5) {
    return this.request(
      "get",
      `stock/${ticker.toUpperCase()}/historical-context?years=${years}`
    );
  }
}

const stockServiceInstance = new StockService();
export default stockServiceInstance;
