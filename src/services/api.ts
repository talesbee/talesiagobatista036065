import axios from 'axios';
import { refreshToken as refreshTokenApi } from './authService';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

export interface TokenData {
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  refreshExpiresAt: number | null;
}

function getTokenData(): TokenData {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
  const refreshExpiresAt = localStorage.getItem('refreshExpiresAt');
  return {
    token,
    refreshToken,
    tokenExpiresAt: tokenExpiresAt ? parseInt(tokenExpiresAt) : null,
    refreshExpiresAt: refreshExpiresAt ? parseInt(refreshExpiresAt) : null,
  };
}

export function setTokenData({
  access_token,
  refresh_token,
  expires_in,
  refresh_expires_in,
}: TokenResponse): void {
  const now = Date.now();
  localStorage.setItem('token', access_token);
  localStorage.setItem('refreshToken', refresh_token);
  localStorage.setItem('tokenExpiresAt', String(now + expires_in * 1000));
  localStorage.setItem('refreshExpiresAt', String(now + refresh_expires_in * 1000));
}

function clearTokenData() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresAt');
  localStorage.removeItem('refreshExpiresAt');
}

async function ensureValidToken() {
  const { token, refreshToken, tokenExpiresAt, refreshExpiresAt } = getTokenData();
  const now = Date.now();
  if (!token || !tokenExpiresAt) return null;
  if (tokenExpiresAt - now < 60000 && refreshToken && refreshExpiresAt && refreshExpiresAt > now) {
    try {
      const res = await refreshTokenApi(refreshToken);
      setTokenData(res);
      return res.access_token;
    } catch (err) {
      clearTokenData();
      return null;
    }
  }
  if (tokenExpiresAt > now) {
    return token;
  }
  clearTokenData();
  return null;
}

const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip',
});

api.interceptors.request.use(async (config) => {
  const isAuthRoute =
    config.url?.includes('/autenticacao/login') || config.url?.includes('/autenticacao/refresh');
  if (!isAuthRoute) {
    const token = await ensureValidToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/autenticacao/refresh')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      const refreshExpiresAt = localStorage.getItem('refreshExpiresAt');
      const now = Date.now();
      if (refreshToken && refreshExpiresAt && parseInt(refreshExpiresAt) > now) {
        try {
          const res = await refreshTokenApi(refreshToken);
          setTokenData(res);
          originalRequest.headers['Authorization'] = `Bearer ${res.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          clearTokenData();
          if (!(window as any).__forceLogout) {
            (window as any).__forceLogout = true;
            window.location.replace('/');
          }
          return Promise.reject(refreshError);
        }
      } else {
        clearTokenData();
        if (!(window as any).__forceLogout) {
          (window as any).__forceLogout = true;
          window.location.replace('/');
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
