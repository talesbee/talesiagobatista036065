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
  tutores?: Tutor[] | null;
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

export interface TutorFoto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Tutor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
  foto?: TutorFoto | null;
  pets?: Pet[] | null;
}

export interface TutorPayload {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
}

export interface TutorsResponse {
  content: Tutor[];
  page: number;
  size: number;
  total: number;
  pageCount: number;
}
export interface TutorFormData {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: string;
  foto?: File | null;
}
