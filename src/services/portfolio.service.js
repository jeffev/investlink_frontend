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

  async getFiiPortfolio() {
    return this.request("get", "portfolio/fii");
  }

  async addFiiPosition(data) {
    return this.request("post", "portfolio/fii", data);
  }

  async editFiiPosition(positionId, data) {
    return this.request("put", `portfolio/fii/${positionId}`, data);
  }

  async deleteFiiPosition(positionId) {
    return this.request("delete", `portfolio/fii/${positionId}`);
  }

  async getProjectedIncome() {
    return this.request("get", "portfolio/projected-income");
  }

  async getBenchmarks() {
    return this.request("get", "benchmarks");
  }

  async getTransactions() {
    return this.request("get", "transactions");
  }

  async createTransaction(data) {
    return this.request("post", "transactions", data);
  }

  async deleteTransaction(id) {
    return this.request("delete", `transaction/${id}`);
  }
}

const portfolioServiceInstance = new PortfolioService();
export default portfolioServiceInstance;
