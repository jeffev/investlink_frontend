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
        const refreshed = await AuthService.refresh();
        if (refreshed) {
          try {
            const retryResponse = await axios({
              method,
              url: `${this.apiUrl}${endpoint}`,
              headers: { Authorization: `Bearer ${AuthService.getToken()}` },
              data,
            });
            return retryResponse.data;
          } catch {
            // refresh succeeded but retry failed — proceed to logout
          }
        }
        AuthService.logout();
        window.location.href = "/login";
      }
      // 404 não é falha: é o recurso que ainda não existe, e quem chamou
      // decide o que fazer com isso. Registrar como erro enchia o console de
      // vermelho em todo primeiro acesso, escondendo o erro de verdade.
      if (error.response?.status !== 404) {
        console.error(`Error with ${method.toUpperCase()} request to ${endpoint}:`, error);
      }
      throw error;
    }
  }
}

export default ApiService;
