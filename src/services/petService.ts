import api from './api';
import { Pet, PetPayload, PetsResponse } from '../types';

export async function getPets(
  page = 0,
  size = 10,
  nome?: string,
  raca?: string,
): Promise<PetsResponse> {
  const params: any = { page, size };
  if (nome) params.nome = nome;
  if (raca) params.raca = raca;
  const response = await api.get('/v1/pets', { params });
  return response.data;
}

export async function getPetById(id: number): Promise<Pet> {
  const response = await api.get(`/v1/pets/${id}`);
  return response.data;
}

export async function postPet(params: PetPayload): Promise<Pet> {
  const response = await api.post('/v1/pets', params);
  return response.data;
}

export async function putPet(id: number, params: PetPayload): Promise<Pet> {
  const response = await api.put(`/v1/pets/${id}`, params);
  return response.data;
}

export async function deletePet(id: number): Promise<void> {
  await api.delete(`/v1/pets/${id}`);
}

export async function uploadPetPhoto(petId: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('foto', file);
  await api.post(`/v1/pets/${petId}/fotos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function deletePetPhoto(petId: number, photoId: number): Promise<void> {
  await api.delete(`/v1/pets/${petId}/fotos/${photoId}`);
}
