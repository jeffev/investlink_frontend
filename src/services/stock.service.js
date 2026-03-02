import axios from "axios";
import AuthService from "./auth.service";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/v1/";

class StockService {
  constructor() {
    this.apiUrl = API_URL;
  }

  async request(method, endpoint, data = null) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Token not found");
    }

    try {
      const response = await axios({
        method,
        url: `${this.apiUrl}${endpoint}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      });
      return response.data;
    } catch (error) {
      console.error(`Error with ${method.toUpperCase()} request to ${endpoint}:`, error);
      throw error;
    }
  }

  async getAllStocks() {
    const response = await this.request("get", "stocks");
    const stocks = response.data;

    const favoritas = stocks.filter(item => item.favorita);
    const naoFavoritas = stocks.filter(item => !item.favorita);

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