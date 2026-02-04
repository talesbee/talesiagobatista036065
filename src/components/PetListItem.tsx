import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Close, Warning } from '../assets/icons';
import { Pet } from '../types';
import { useTranslation } from 'react-i18next';

interface PetListItemProps {
  pet: Partial<Pet>;
  onRemove?: () => void;
  removeLabel?: string;
  onClick?: () => void;
  showRemove?: boolean;
}

const PetListItem: React.FC<PetListItemProps> = ({
  pet,
  onRemove,
  removeLabel,
  onClick,
  showRemove = true,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleItemClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.remove-btn')) return;
    if (onClick) return onClick();
    navigate(`/petsview/${pet.id}`);
  };
  return (
    <li
      className="flex items-center bg-gray-50 rounded-lg p-3 shadow relative cursor-pointer hover:bg-blue-50 transition"
      onClick={handleItemClick}
      tabIndex={0}
      role="button"
      aria-label={pet.nome}
    >
      {pet.foto?.url ? (
        <img
          src={pet.foto.url}
          alt={pet.nome}
          className="w-12 h-12 rounded-full object-cover border mr-3"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3">
          <Warning className="w-8 h-8" />
        </div>
      )}
      <div className="flex-1">
        <div className="font-medium text-base">{pet.nome}</div>
        <div className="text-sm text-gray-600">
          {t('petForm.breed')}: {pet.raca}
        </div>
        <div className="text-sm text-gray-600">
          {t('petForm.age')}: {pet.idade}
        </div>
      </div>
      {showRemove && onRemove && (
        <button
          type="button"
          className="ml-2 p-2 rounded-full bg-white shadow hover:bg-gray-100 remove-btn"
          aria-label={removeLabel}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Close className="w-5 h-5 text-red-500" />
        </button>
      )}
    </li>
  );
};

export default PetListItem;
