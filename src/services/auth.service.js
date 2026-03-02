import axios from "axios";
import UserLayoutService from "./userLayout.service";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/v1/";

class AuthService {
  async login(user_name, password) {
    try {
      const response = await axios.post(`${API_URL}user/login`, {
        user_name,
        password,
      });
      if (response.status === 200) {
        const { access_token, profile, name, user_name } = response.data;
        this.setUserSession({ profile, name, user_name, access_token });

        // Carregar o layout após o login
        await this.loadUserLayout();
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      return error.response;
    }
  }

  logout() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("stateListaAcoes");
    sessionStorage.removeItem("stateListaFiis");
    sessionStorage.removeItem("stateListaFavoritas");
    sessionStorage.removeItem("stateListaFavoritosFiis");
  }

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}users`, userData);
      if (response.status === 201) {
        const { access_token, profile, name, user_name } = response.data;
        this.setUserSession({ profile, name, user_name, access_token });
      }
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      return error.response;
    }
  }

  setUserSession({ profile, name, user_name, access_token }) {
    sessionStorage.setItem(
      "user",
      JSON.stringify({ profile, name, user_name, access_token })
    );
  }

  async loadUserLayout() {
    try {
      const layoutAcoes = await UserLayoutService.getLayout("ListaAcoes");
      if (layoutAcoes) {
        sessionStorage.setItem("stateListaAcoes", layoutAcoes);
      } else {
        sessionStorage.removeItem("stateListaAcoes");
      }
    } catch (error) {
      console.error("Error loading user layout for ListaAcoes:", error);
      sessionStorage.removeItem("stateListaAcoes");
    }

    try {
      const layoutFiis = await UserLayoutService.getLayout("ListaFiis");
      if (layoutFiis) {
        sessionStorage.setItem("stateListaFiis", layoutFiis);
      } else {
        sessionStorage.removeItem("stateListaFiis");
      }
    } catch (error) {
      console.error("Error loading user layout for ListaFiis:", error);
      sessionStorage.removeItem("stateListaFiis");
    }

    try {
      const layoutFiis = await UserLayoutService.getLayout("ListaFavoritas");
      if (layoutFiis) {
        sessionStorage.setItem("stateListaFavoritas", layoutFiis);
      } else {
        sessionStorage.removeItem("stateListaFavoritas");
      }
    } catch (error) {
      console.error("Error loading user layout for ListaFavoritas:", error);
      sessionStorage.removeItem("stateListaFavoritas");
    }

    try {
      const layoutFiis = await UserLayoutService.getLayout("ListaFavoritosFiis");
      if (layoutFiis) {
        sessionStorage.setItem("stateListaFavoritosFiis", layoutFiis);
      } else {
        sessionStorage.removeItem("stateListaFavoritosFiis");
      }
    } catch (error) {
      console.error("Error loading user layout for ListaFavoritas:", error);
      sessionStorage.removeItem("stateListaFavoritosFiis");
    }
  }

  getCurrentUser() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user ? user.profile : null;
  }

  getCurrentUsername() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user ? user.user_name : null;
  }

  getToken() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user ? user.access_token : null;
  }

  isAuthenticated() {
    return !!sessionStorage.getItem("user");
  }

  isAdmin() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) return false;
    return user.profile === "ADMIN";
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
