import ApiService from "./api.service";

class UserLayoutService extends ApiService {
  async saveLayout(layout, estado) {
    return this.request("post", "user_layout", { layout, estado });
  }

  async getLayout(layout) {
    return this.request("get", `user_layout/${layout}`);
  }
}

const userLayoutServiceInstance = new UserLayoutService();
export default userLayoutServiceInstance;
