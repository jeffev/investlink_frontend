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
    const layouts = [
      { name: "ListaAcoes", key: "stateListaAcoes" },
      { name: "ListaFiis", key: "stateListaFiis" },
      { name: "ListaFavoritas", key: "stateListaFavoritas" },
      { name: "ListaFavoritosFiis", key: "stateListaFavoritosFiis" },
    ];

    for (const { name, key } of layouts) {
      try {
        const layout = await UserLayoutService.getLayout(name);
        if (layout) {
          sessionStorage.setItem(key, layout);
        } else {
          sessionStorage.removeItem(key);
        }
      } catch (error) {
        console.error(`Error loading user layout for ${name}:`, error);
        sessionStorage.removeItem(key);
      }
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
