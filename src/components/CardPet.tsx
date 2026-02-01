import { Pet } from '../types';

interface CardPetProps {
  pet: Pet;
  onClick?: () => void;
}

export default function CardPet({ pet, onClick }: CardPetProps) {
  return (
    <div
      className="bg-white rounded shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      {pet.foto && pet.foto.url && (
        <img
          src={pet.foto.url}
          alt={pet.nome}
          className="w-24 h-24 object-cover rounded-full mb-2"
        />
      )}
      <div className="font-bold text-lg mb-1">{pet.nome}</div>
      <div className="text-gray-600">{pet.raca}</div>
      <div className="text-gray-500 text-sm">Idade: {pet.idade ?? '-'}</div>
    </div>
  );
}
