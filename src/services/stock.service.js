import ApiService from "./api.service";

class StockService extends ApiService {
  async getAllStocks({ page = 1, pageSize = 50, sorting = [], columnFilters = [] } = {}) {
    const params = new URLSearchParams({ page, per_page: pageSize });
    if (sorting.length > 0) {
      params.set("sort_by", sorting[0].id);
      params.set("sort_dir", sorting[0].desc ? "desc" : "asc");
    }
    if (columnFilters.length > 0) {
      params.set("filters", JSON.stringify(columnFilters));
    }
    return this.request("get", `stocks?${params.toString()}`);
  }

  async addFavorite(stockId) {
    return this.request("post", `favorites/${stockId}`);
  }

  async removeFavorite(stockTicker) {
    return this.request("delete", `favorites/${stockTicker}`);
  }

  async getFavorites() {
    return this.request("get", "favorites");
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
}

const stockServiceInstance = new StockService();
export default stockServiceInstance;
