import { Warning } from '../assets/icons';
import { Pet } from '../types';
import { useTranslation } from 'react-i18next';

interface CardPetProps {
  pet: Pet;
  onClick?: () => void;
}

export default function CardPet({ pet, onClick }: CardPetProps) {
  const { t } = useTranslation();
  return (
    <div
      className="bg-white rounded shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      {pet.foto && pet.foto.url ? (
        <img
          src={pet.foto.url}
          alt={pet.nome}
          className="w-24 h-24 object-cover rounded-full mb-2"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-500">
          <Warning className="w-12 h-12" />
        </div>
      )}
      <div className="font-bold text-lg mb-1">{pet.nome}</div>
      <div className="text-gray-600">
        {t('cardPet.breed')}: {pet.raca}
      </div>
      <div className="text-gray-500 text-sm">
        {t('cardPet.age')}: {pet.idade ?? '-'}
      </div>
    </div>
  );
}
