import axios from "axios";
import AuthService from "./auth.service";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/v1/";

class UserLayoutService {
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

  async saveLayout(layout, estado) {
    return this.request("post", "user_layout", { layout, estado });
  }

  async getLayout(layout) {
    return this.request("get", `user_layout/${layout}`);
  }
}

const userLayoutServiceInstance = new UserLayoutService();
export default userLayoutServiceInstance;