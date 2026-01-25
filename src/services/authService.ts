import api from './api';

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

export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  const response = await api.put('/autenticacao/refresh', null, {
    headers: {
      Authorization: refreshToken,
    },
  });
  return response.data;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post('/autenticacao/login', payload);
  return response.data;
}
