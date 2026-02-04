import api from './api';
import { Tutor, TutorPayload, TutorsResponse } from '../types';

export async function getTutores(page = 0, size = 10, nome?: string): Promise<TutorsResponse> {
  const params: any = { page, size };
  if (nome) params.nome = nome;
  const response = await api.get('/v1/tutores', { params });
  return response.data;
}

export async function getTutorById(id: number): Promise<Tutor> {
  const response = await api.get(`/v1/tutores/${id}`);
  return response.data;
}

export async function postTutor(params: TutorPayload): Promise<Tutor> {
  const response = await api.post('/v1/tutores', params);
  return response.data;
}

export async function putTutor(id: number, params: TutorPayload): Promise<Tutor> {
  const response = await api.put(`/v1/tutores/${id}`, params);
  return response.data;
}

export async function deleteTutor(id: number): Promise<void> {
  await api.delete(`/v1/tutores/${id}`);
}

export async function uploadTutorPhoto(tutorId: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('foto', file);
  await api.post(`/v1/tutores/${tutorId}/fotos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function deleteTutorPhoto(tutorId: number, photoId: number): Promise<void> {
  await api.delete(`/v1/tutores/${tutorId}/fotos/${photoId}`);
}

export async function linkTutorPet(tutorId: number, petId: number): Promise<void> {
  await api.post(`/v1/tutores/${tutorId}/pets/${petId}`);
}

export async function unlinkTutorPet(tutorId: number, petId: number): Promise<void> {
  await api.delete(`/v1/tutores/${tutorId}/pets/${petId}`);
}
