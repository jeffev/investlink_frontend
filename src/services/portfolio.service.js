import ApiService from "./api.service";

// The listing endpoints gained the same pagination envelope as favorites.
// Unwrapped here rather than in the pages: a personal portfolio never
// approaches the 200-position page, and the pages already treat these as
// plain arrays.
const PAGE_SIZE = 200;

function unwrap(response) {
  return Array.isArray(response) ? response : response?.data || [];
}

class PortfolioService extends ApiService {
  async getPortfolio(page = 1) {
    const response = await this.request(
      "get",
      `portfolio?page=${page}&per_page=${PAGE_SIZE}`
    );
    return unwrap(response);
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

  async getFiiPortfolio(page = 1) {
    return this.request(
      "get",
      `portfolio/fii?page=${page}&per_page=${PAGE_SIZE}`
    ).then(unwrap);
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
