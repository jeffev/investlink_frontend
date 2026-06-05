import ApiService from "./api.service";

class StrategyService extends ApiService {
  async getStrategies(assetType) {
    return this.request("get", `strategies?asset_type=${assetType}`);
  }

  async createStrategy(data) {
    return this.request("post", "strategies", data);
  }

  async deleteStrategy(id) {
    return this.request("delete", `strategy/${id}`);
  }
}

const strategyServiceInstance = new StrategyService();
export default strategyServiceInstance;
