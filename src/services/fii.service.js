import ApiService from "./api.service";

class FiiService extends ApiService {
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
