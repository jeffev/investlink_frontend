export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/v1/";

// A sonda de saúde mora fora do /v1 no backend.
export const HEALTH_URL = API_URL.replace(/v1\/?$/, "") + "health";

// Na demo pública o visitante entra sem senha, pela conta compartilhada.
// Sem a variável, a tela de login volta a ser a de sempre, com cadastro.
export const IS_DEMO = process.env.REACT_APP_DEMO_MODE === "true";
