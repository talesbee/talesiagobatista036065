import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { petFacade, PetFacade } from './PetFacade';
import * as petService from '../services/petService';
import type { Pet, PetsResponse, PetPayload } from '../types';

describe('PetFacade', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    (petFacade as any).petsSubject?.next([]);
    (petFacade as any).selectedPetSubject?.next(null);
    vi.resetAllMocks();
  });

  it('loadPets carrega e atualiza o snapshot', async () => {
    const pet: Pet = { id: 1, nome: 'Rex' } as Pet;
    const response: PetsResponse = { content: [pet], page: 0, size: 10, total: 1, pageCount: 1 };
    vi.spyOn(petService, 'getPets').mockResolvedValueOnce(response as any);

    const res = await petFacade.loadPets();
    expect(res).toEqual(response);
    expect(petFacade.getSnapshot()).toEqual([pet]);
  });

  it('createPet chama o serviço e adiciona o pet no início do snapshot', async () => {
    const payload: PetPayload = { nome: 'Boby', raca: 'SRD', idade: 2 } as PetPayload;
    const created: Pet = { id: 10, ...payload } as Pet;
    vi.spyOn(petService, 'postPet').mockResolvedValueOnce(created as any);

    const res = await petFacade.createPet(payload);
    expect(res).toEqual(created);
    const snap = petFacade.getSnapshot();
    expect(snap[0]).toEqual(created);
  });

  it('selectPet atualiza o observable selectedPet', () => {
    const pet: Pet = { id: 2, nome: 'Luna' } as Pet;
    let observed: Pet | null = null;
    const sub = petFacade.selectedPet$().subscribe((v) => (observed = v));
    petFacade.selectPet(pet);
    expect(observed).toEqual(pet);
    sub.unsubscribe();
  });

  it('updateLocalPet substitui o pet no snapshot e no selecionado se corresponder', async () => {
    const pet: Pet = { id: 5, nome: 'Old' } as Pet;
    (petFacade as any).petsSubject.next([pet]);
    (petFacade as any).selectedPetSubject.next(pet);

    const updated: Pet = { id: 5, nome: 'Updated' } as Pet;
    petFacade.updateLocalPet(updated);

    const snap = petFacade.getSnapshot();
    expect(snap.find((p) => p.id === 5)?.nome).toEqual('Updated');
    expect((petFacade as any).selectedPetSubject.getValue().nome).toEqual('Updated');
  });
});
