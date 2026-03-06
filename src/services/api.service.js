import axios from "axios";
import AuthService from "./auth.service";
import { API_URL } from "../config/api";

class ApiService {
  constructor() {
    this.apiUrl = API_URL;
  }

  async request(method, endpoint, data = null) {
    const token = AuthService.getToken();
    if (!token) {
      window.location.href = "/login";
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
      if (error.response?.status === 401) {
        AuthService.logout();
        window.location.href = "/login";
      }
      console.error(`Error with ${method.toUpperCase()} request to ${endpoint}:`, error);
      throw error;
    }
  }
}

export default ApiService;
