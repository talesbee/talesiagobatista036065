import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { tutorFacade } from './TutorFacade';
import * as tutorService from '../services/tutorService';
import { petFacade } from './PetFacade';
import type { Tutor, TutorsResponse, TutorPayload, Pet } from '../types';

describe('TutorFacade', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    (tutorFacade as any).tutorsSubject?.next([]);
    (tutorFacade as any).selectedTutorSubject?.next(null);
    (petFacade as any).petsSubject?.next([]);
    vi.resetAllMocks();
  });

  it('loadTutors carrega e atualiza o snapshot', async () => {
    const tutor: Tutor = {
      id: 1,
      nome: 'Ana',
      email: '',
      telefone: '',
      endereco: '',
      cpf: 0,
    } as Tutor;
    const response: TutorsResponse = {
      content: [tutor],
      page: 0,
      size: 10,
      total: 1,
      pageCount: 1,
    };
    vi.spyOn(tutorService, 'getTutores').mockResolvedValueOnce(response as any);

    const res = await tutorFacade.loadTutors();
    expect(res).toEqual(response);
    expect(tutorFacade.getSnapshot()).toEqual([tutor]);
  });

  it('createTutor chama o serviço e adiciona tutor no início do snapshot', async () => {
    const payload: TutorPayload = {
      nome: 'Paulo',
      email: 'p@p.com',
      telefone: '0000',
      endereco: 'rua',
      cpf: 123,
    } as TutorPayload;
    const created: Tutor = { id: 10, ...payload } as Tutor;
    vi.spyOn(tutorService, 'postTutor').mockResolvedValueOnce(created as any);

    const res = await tutorFacade.createTutor(payload);
    expect(res).toEqual(created);
    const snap = tutorFacade.getSnapshot();
    expect(snap[0]).toEqual(created);
  });

  it('selectTutor atualiza o observable selectedTutor', () => {
    const tutor: Tutor = {
      id: 2,
      nome: 'Carlos',
      email: '',
      telefone: '',
      endereco: '',
      cpf: 0,
    } as Tutor;
    let observed: Tutor | null = null;
    const sub = tutorFacade.selectedTutor$().subscribe((v) => (observed = v));
    tutorFacade.selectTutor(tutor);
    expect(observed).toEqual(tutor);
    sub.unsubscribe();
  });

  it('linkTutorPet chama serviço e atualiza estados locais (pet e tutor)', async () => {
    const tutor: Tutor = {
      id: 5,
      nome: 'Lena',
      email: '',
      telefone: '',
      endereco: '',
      cpf: 0,
    } as Tutor;
    const pet: Pet = { id: 7, nome: 'Rex' } as Pet;

    (tutorFacade as any).tutorsSubject.next([tutor]);
    (petFacade as any).petsSubject.next([pet]);

    const linkSpy = vi.spyOn(tutorService, 'linkTutorPet').mockResolvedValueOnce(undefined as any);
    const updatePetSpy = vi.spyOn(petFacade, 'updateLocalPet');

    await tutorFacade.linkTutorPet(tutor.id, pet.id);

    expect(linkSpy).toHaveBeenCalledWith(tutor.id, pet.id);
    expect(updatePetSpy).toHaveBeenCalled();

    const tutors = tutorFacade.getSnapshot();
    const updated = tutors.find((t) => t.id === tutor.id);
    expect(updated).toBeDefined();
    expect(updated?.pets && updated?.pets[0].id).toEqual(pet.id);
  });
});
