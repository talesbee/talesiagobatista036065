export interface PetFoto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Pet {
  id: number;
  nome: string;
  raca?: string;
  idade?: number;
  foto?: PetFoto | null;
  tutor?: number;
}

export interface PetPayload {
  nome: string;
  raca: string;
  idade: number;
}

export interface PetsResponse {
  content: Pet[];
  page: number;
  size: number;
  total: number;
  pageCount: number;
}

export interface PetFormData {
  nome: string;
  idade: number;
  raca: string;
  foto?: File | null;
}
