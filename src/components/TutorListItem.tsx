import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Close, Warning } from '../assets/icons';
import { maskCellPhone } from '../Uteis';
import { Tutor } from '../types';

interface TutorListItemProps {
  tutor: Partial<Tutor>;
  onRemove: () => void;
  removeLabel: string;
}

const TutorListItem: React.FC<TutorListItemProps> = ({ tutor, onRemove, removeLabel }) => {
  const navigate = useNavigate();
  // Evita navegação ao clicar no botão de remover
  const handleItemClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/tutoresview/${tutor.id}`);
  };
  return (
    <li
      className="flex items-center bg-gray-50 rounded-lg p-3 shadow relative cursor-pointer hover:bg-blue-50 transition"
      onClick={handleItemClick}
      tabIndex={0}
      role="button"
      aria-label={tutor.nome}
    >
      {tutor.foto?.url ? (
        <img
          src={tutor.foto.url}
          alt={tutor.nome}
          className="w-12 h-12 rounded-full object-cover border mr-3"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-500 mr-3">
          <Warning className="w-8 h-8" />
        </div>
      )}
      <div className="flex-1">
        <div className="font-medium text-base">{tutor.nome}</div>
        <div className="text-sm text-gray-600">
          {tutor.telefone ? maskCellPhone(tutor.telefone) : tutor.email}
        </div>
      </div>
      <button
        type="button"
        className="ml-2 p-2 rounded-full bg-white shadow hover:bg-gray-100"
        aria-label={removeLabel}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Close className="w-5 h-5 text-red-500" />
      </button>
    </li>
  );
};

export default TutorListItem;
