import ApiService from "./api.service";

class BacktestService extends ApiService {
  async runBacktest(strategyId, startDate) {
    const params = new URLSearchParams({ start_date: startDate });
    return this.request("get", `strategy/${strategyId}/backtest?${params}`);
  }
}

const backtestService = new BacktestService();
export default backtestService;
