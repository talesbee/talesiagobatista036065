import axios from "axios";
import { refreshToken as refreshTokenApi } from "./authService";

const api = axios.create({
  baseURL: "https://pet-manager-api.geia.vip",
});

// Adiciona o access_token no header Authorization de cada requisição
api.interceptors.request.use((config) => {
  // Não adiciona o token nas rotas de login e refresh
  const isAuthRoute =
    config.url?.includes("/autenticacao/login") ||
    config.url?.includes("/autenticacao/refresh");
  if (!isAuthRoute) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor de resposta para tentar renovar o token automaticamente em caso de 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Não tente refresh se a requisição original já for o refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/autenticacao/refresh")
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await refreshTokenApi(refreshToken);
          localStorage.setItem("token", res.access_token);
          localStorage.setItem("refreshToken", res.refresh_token);
          originalRequest.headers["Authorization"] =
            `Bearer ${res.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          if (!(window as any).__forceLogout) {
            (window as any).__forceLogout = true;
            window.location.replace("/");
          }
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
