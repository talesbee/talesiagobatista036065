import axios from 'axios';
import { refreshToken as refreshTokenApi } from './authService';

const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip',
});

// Adiciona o access_token no header Authorization de cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta para tentar renovar o token automaticamente em caso de 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await refreshTokenApi(refreshToken);
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('refreshToken', res.refresh_token);
          // Atualiza o header e repete a requisição original
          originalRequest.headers['Authorization'] = `Bearer ${res.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Se o refresh falhar, faz logout (remove tokens)
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
