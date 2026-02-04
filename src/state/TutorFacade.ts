import { BehaviorSubject, Observable } from 'rxjs';
import { Tutor, TutorsResponse, TutorPayload, Pet } from '../types';
import * as tutorService from '../services/tutorService';
import { petFacade } from './PetFacade';

export class TutorFacade {
  private tutorsSubject = new BehaviorSubject<Tutor[]>([]);
  private selectedTutorSubject = new BehaviorSubject<Tutor | null>(null);

  tutors$(): Observable<Tutor[]> {
    return this.tutorsSubject.asObservable();
  }

  selectedTutor$(): Observable<Tutor | null> {
    return this.selectedTutorSubject.asObservable();
  }

  getSnapshot(): Tutor[] {
    return this.tutorsSubject.getValue();
  }

  async loadTutors(page = 0, size = 10, nome?: string): Promise<TutorsResponse> {
    const res = await tutorService.getTutores(page, size, nome);
    this.tutorsSubject.next(res.content || []);
    return res;
  }

  async createTutor(payload: TutorPayload): Promise<Tutor> {
    const created = await tutorService.postTutor(payload);
    const current = this.getSnapshot();
    this.tutorsSubject.next([created, ...current]);
    return created;
  }

  async getTutorById(id: number): Promise<Tutor> {
    const res = await tutorService.getTutorById(id);
    this.selectedTutorSubject.next(res);
    return res;
  }

  async updateTutor(id: number, payload: TutorPayload): Promise<Tutor> {
    const updated = await tutorService.putTutor(id, payload);
    const tutors = this.getSnapshot().map((t) => (t.id === id ? updated : t));
    this.tutorsSubject.next(tutors);
    const sel = this.selectedTutorSubject.getValue();
    if (sel && sel.id === id) this.selectedTutorSubject.next(updated);
    return updated;
  }

  async uploadPhoto(tutorId: number, file: File): Promise<void> {
    await tutorService.uploadTutorPhoto(tutorId, file);
    const updated = await tutorService.getTutorById(tutorId);
    const tutors = this.getSnapshot().map((t) => (t.id === tutorId ? updated : t));
    this.tutorsSubject.next(tutors);
    const sel = this.selectedTutorSubject.getValue();
    if (sel && sel.id === tutorId) this.selectedTutorSubject.next(updated);
  }

  async deletePhoto(tutorId: number, photoId: number): Promise<void> {
    await tutorService.deleteTutorPhoto(tutorId, photoId);
    const updated = await tutorService.getTutorById(tutorId);
    const tutors = this.getSnapshot().map((t) => (t.id === tutorId ? updated : t));
    this.tutorsSubject.next(tutors);
    const sel = this.selectedTutorSubject.getValue();
    if (sel && sel.id === tutorId) this.selectedTutorSubject.next(updated);
  }

  async unlinkTutorPet(tutorId: number, petId: number): Promise<void> {
    await tutorService.unlinkTutorPet(tutorId, petId);
    const tutors = this.getSnapshot();
    const tutor = tutors.find((t) => t.id === tutorId) || this.selectedTutorSubject.getValue();
    if (tutor) {
      const updatedTutor: Tutor = {
        ...tutor,
        pets: tutor.pets ? tutor.pets.filter((p) => p.id !== petId) : [],
      };
      const nextTutors = tutors.map((t) => (t.id === tutorId ? updatedTutor : t));
      this.tutorsSubject.next(nextTutors);
      const sel = this.selectedTutorSubject.getValue();
      if (sel && sel.id === tutorId) this.selectedTutorSubject.next(updatedTutor);
    }
    const pets = petFacade.getSnapshot();
    const pet = pets.find((p) => p.id === petId);
    if (pet) {
      const petWithoutTutor: Pet = {
        ...pet,
        tutores: pet.tutores ? pet.tutores.filter((t) => t.id !== tutorId) : [],
      };
      petFacade.updateLocalPet(petWithoutTutor);
    }
  }

  selectTutor(tutor: Tutor | null): void {
    this.selectedTutorSubject.next(tutor);
  }

  async linkTutorPet(tutorId: number, petId: number): Promise<void> {
    await tutorService.linkTutorPet(tutorId, petId);
    const tutors = this.getSnapshot();
    const tutor = tutors.find((t) => t.id === tutorId) || this.selectedTutorSubject.getValue();
    const pets = petFacade.getSnapshot();
    const pet = pets.find((p) => p.id === petId);

    if (pet && tutor) {
      const petWithTutor: Pet = {
        ...pet,
        tutores: pet.tutores ? [...(pet.tutores || []), tutor] : [tutor],
      };
      petFacade.updateLocalPet(petWithTutor);

      const updatedTutor: Tutor = {
        ...(tutor as Tutor),
        pets: tutor.pets ? [...(tutor.pets || []), pet] : [pet],
      };
      const nextTutors = tutors.map((t) => (t.id === tutorId ? updatedTutor : t));
      this.tutorsSubject.next(nextTutors);
      const sel = this.selectedTutorSubject.getValue();
      if (sel && sel.id === tutorId) this.selectedTutorSubject.next(updatedTutor);
    }
  }
}

export const tutorFacade = new TutorFacade();
