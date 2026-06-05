import ApiService from "./api.service";

class NewsService extends ApiService {
  async getNews({ tickers = [], page = 1, perPage = 20 } = {}) {
    const params = new URLSearchParams({ page, per_page: perPage });
    if (tickers.length > 0) {
      params.set("tickers", tickers.join(","));
    }
    return this.request("get", `news?${params}`);
  }
}

const newsService = new NewsService();
export default newsService;
