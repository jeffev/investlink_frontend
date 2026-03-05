import axios from "axios";
import AuthService from "./auth.service";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/v1/";

class ApiService {
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
}

export default ApiService;
