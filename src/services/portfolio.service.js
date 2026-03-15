import ApiService from "./api.service";

class PortfolioService extends ApiService {
  async getPortfolio() {
    return this.request("get", "portfolio");
  }

  async getPortfolioSummary() {
    return this.request("get", "portfolio/summary");
  }

  async addPosition(data) {
    return this.request("post", "portfolio", data);
  }

  async editPosition(positionId, data) {
    return this.request("put", `portfolio/${positionId}`, data);
  }

  async deletePosition(positionId) {
    return this.request("delete", `portfolio/${positionId}`);
  }
}

const portfolioServiceInstance = new PortfolioService();
export default portfolioServiceInstance;
