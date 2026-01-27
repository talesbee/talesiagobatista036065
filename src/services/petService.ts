import api from "./api";

export interface PetFoto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Pet {
  id: number;
  nome: string;
  especie?: string;
  raca?: string;
  idade?: number;
  foto?: PetFoto | null;
  tutorId?: number;
}

export interface PetsResponse {
  content: Pet[];
  page: number;
  size: number;
  total: number;
  pageCount: number;
}

export async function getPets(
  page = 0,
  size = 10,
  nome?: string,
  raca?: string,
): Promise<PetsResponse> {
  const params: any = { page, size };
  if (nome) params.nome = nome;
  if (raca) params.raca = raca;
  const response = await api.get("/v1/pets", { params });
  return response.data;
}
