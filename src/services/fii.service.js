import axios from "axios";
import AuthService from "./auth.service";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/v1/";

class FiiService {
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

  async getAllFIIs() {
    const response = await this.request("get", "fiis");
    return response.data;
  }

  async addFavorite(fiiId) {
    return this.request("post", `favorites/fii/${fiiId}`);
  }

  async removeFavorite(fiiTicker) {
    return this.request("delete", `favorites/fii/${fiiTicker}`);
  }

  async getFavorites() {
    return this.request("get", "favorites/fii");
  }

  async editFavorite(favoriteId, newData) {
    return this.request("put", `favorite/fii/${favoriteId}`, newData);
  }

  async updateFIIs() {
    return this.request("put", "fiis/update-fiis");
  }
}

const fiiServiceInstance = new FiiService();
export default fiiServiceInstance;
