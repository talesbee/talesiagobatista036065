import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import api from './api';
import { postPet } from './petService';
import { postTutor, linkTutorPet } from './tutorService';

const mockedApi = api as unknown as { post: any };

describe('Pet/Tutor services (unit tests with api mock)', () => {
  beforeEach(() => {
    mockedApi.post = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('cria um Pet via postPet', async () => {
    const petPayload = { nome: 'Rex', raca: 'Vira-lata', idade: 3 };
    const createdPet = { id: 123, ...petPayload };

    mockedApi.post.mockResolvedValueOnce({ data: createdPet });

    const res = await postPet(petPayload as any);
    expect(res).toEqual(createdPet);
    expect(mockedApi.post).toHaveBeenCalledWith('/v1/pets', petPayload);
  });

  it('cria um Tutor via postTutor', async () => {
    const tutorPayload = { nome: 'Maria', telefone: '99999-0000' };
    const createdTutor = { id: 55, ...tutorPayload };

    mockedApi.post.mockResolvedValueOnce({ data: createdTutor });

    const res = await postTutor(tutorPayload as any);
    expect(res).toEqual(createdTutor);
    expect(mockedApi.post).toHaveBeenCalledWith('/v1/tutores', tutorPayload);
  });

  it('vincula um Pet a um Tutor via linkTutorPet', async () => {
    const tutorId = 55;
    const petId = 123;

    mockedApi.post.mockResolvedValueOnce({});

    await expect(linkTutorPet(tutorId, petId)).resolves.toBeUndefined();
    expect(mockedApi.post).toHaveBeenCalledWith(`/v1/tutores/${tutorId}/pets/${petId}`);
  });
});
