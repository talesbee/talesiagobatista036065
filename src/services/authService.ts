import api, { setTokenData, TokenResponse } from './api';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

export async function refreshToken(refresh_token: string): Promise<LoginResponse> {
  const response = await api.put('/autenticacao/refresh', undefined, {
    headers: {
      Authorization: `Bearer ${refresh_token}`,
    },
  });
  setTokenData(response.data as TokenResponse);
  return response.data;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post('/autenticacao/login', payload);
  setTokenData(response.data as TokenResponse);
  return response.data;
}
