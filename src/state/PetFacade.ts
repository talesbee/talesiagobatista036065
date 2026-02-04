import { BehaviorSubject, Observable } from 'rxjs';
import { Pet, PetsResponse, PetPayload } from '../types';
import * as petService from '../services/petService';

export class PetFacade {
  private petsSubject = new BehaviorSubject<Pet[]>([]);
  private selectedPetSubject = new BehaviorSubject<Pet | null>(null);

  pets$(): Observable<Pet[]> {
    return this.petsSubject.asObservable();
  }

  selectedPet$(): Observable<Pet | null> {
    return this.selectedPetSubject.asObservable();
  }

  getSnapshot(): Pet[] {
    return this.petsSubject.getValue();
  }

  async loadPets(page = 0, size = 10, nome?: string, raca?: string): Promise<PetsResponse> {
    const res = await petService.getPets(page, size, nome, raca);
    this.petsSubject.next(res.content || []);
    return res;
  }

  async createPet(payload: PetPayload): Promise<Pet> {
    const created = await petService.postPet(payload);
    const current = this.getSnapshot();
    this.petsSubject.next([created, ...current]);
    return created;
  }

  async getPetById(id: number): Promise<Pet> {
    const res = await petService.getPetById(id);
    this.selectedPetSubject.next(res);
    return res;
  }

  async updatePet(id: number, payload: PetPayload): Promise<Pet> {
    const updated = await petService.putPet(id, payload);
    this.updateLocalPet(updated);
    return updated;
  }

  async uploadPhoto(petId: number, file: File): Promise<void> {
    await petService.uploadPetPhoto(petId, file);
    const updated = await petService.getPetById(petId);
    this.updateLocalPet(updated);
  }

  async deletePhoto(petId: number, photoId: number): Promise<void> {
    await petService.deletePetPhoto(petId, photoId);
    const updated = await petService.getPetById(petId);
    this.updateLocalPet(updated);
  }

  selectPet(pet: Pet | null): void {
    this.selectedPetSubject.next(pet);
  }

  updateLocalPet(updated: Pet): void {
    const current = this.getSnapshot();
    const next = current.map((p) => (p.id === updated.id ? updated : p));
    this.petsSubject.next(next);
    const sel = this.selectedPetSubject.getValue();
    if (sel && sel.id === updated.id) this.selectedPetSubject.next(updated);
  }
}

export const petFacade = new PetFacade();
