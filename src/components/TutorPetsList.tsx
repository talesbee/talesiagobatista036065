import React from 'react';
import PetListItem from './PetListItem';
import { Pet } from '../types';

interface TutorPetsListProps {
  pets: Partial<Pet>[];
  onRemove: (petId: number) => void;
  labels: Record<string, string>;
}

const TutorPetsList: React.FC<TutorPetsListProps> = ({ pets, onRemove, labels }) => (
  <div className="mt-8 w-full">
    <div className="font-semibold text-lg mb-3">{labels.petsTitle}</div>
    <ul className="flex flex-col gap-4">
      {pets.map((pet) => (
        <PetListItem
          key={pet.id}
          pet={pet}
          onRemove={() => onRemove(pet.id!)}
          removeLabel={labels.removePet}
        />
      ))}
    </ul>
  </div>
);

export default TutorPetsList;
