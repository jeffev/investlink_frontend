import ApiService from "./api.service";

class StockService extends ApiService {
  async getAllStocks() {
    const response = await this.request("get", "stocks");
    const stocks = response.data;

    const favoritas = stocks.filter((item) => item.favorita);
    const naoFavoritas = stocks.filter((item) => !item.favorita);

    favoritas.sort((a, b) => a.ticker.localeCompare(b.ticker));
    naoFavoritas.sort((a, b) => a.ticker.localeCompare(b.ticker));

    return [...favoritas, ...naoFavoritas];
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
}

const stockServiceInstance = new StockService();
export default stockServiceInstance;
