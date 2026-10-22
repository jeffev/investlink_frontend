export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/v1/";

// A sonda de saúde mora fora do /v1 no backend.
export const HEALTH_URL = API_URL.replace(/v1\/?$/, "") + "health";

// Conta compartilhada da demo pública. Sem as variáveis, a tela de login
// volta a ser a de sempre, com cadastro.
export const DEMO_USER = process.env.REACT_APP_DEMO_USER || "";
export const DEMO_PASSWORD = process.env.REACT_APP_DEMO_PASSWORD || "";
export const IS_DEMO = Boolean(DEMO_USER && DEMO_PASSWORD);
