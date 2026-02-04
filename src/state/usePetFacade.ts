import { useEffect, useState, useCallback } from 'react';
import { petFacade } from './PetFacade';
import type { Pet, PetPayload } from '../types';

export function usePetFacade() {
  const [pets, setPets] = useState<Pet[]>(petFacade.getSnapshot());
  const [selected, setSelected] = useState<Pet | null>(
    petFacade.selectedPet$().getValue?.() ?? null,
  );

  useEffect(() => {
    const sub1 = petFacade.pets$().subscribe(setPets);
    const sub2 = petFacade.selectedPet$().subscribe(setSelected);
    // carregar inicialmente (ignora erros)
    petFacade.loadPets().catch(() => {});
    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  }, []);

  const createPet = useCallback((payload: PetPayload) => petFacade.createPet(payload), []);
  const selectPet = useCallback((p: Pet | null) => petFacade.selectPet(p), []);

  return { pets, selected, createPet, selectPet, reload: petFacade.loadPets.bind(petFacade) };
}
