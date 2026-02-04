import React from 'react';
import { Warning, Edit } from '../assets/icons';
import { maskCellPhone, maskCPF } from '../Uteis';
import { Tutor } from '../types';

interface TutorDetailsCardProps {
  tutor: Partial<Tutor>;
  labels: Record<string, string>;
  onEdit: () => void;
}

const TutorDetailsCard: React.FC<TutorDetailsCardProps> = ({ tutor, labels, onEdit }) => (
  <div className="bg-white rounded shadow p-6 flex flex-col items-center relative">
    <button
      type="button"
      className="absolute top-2 right-2 p-1 rounded-full bg-white shadow hover:bg-gray-100 z-10"
      onClick={onEdit}
      aria-label={labels.edit}
    >
      <Edit className="w-6 h-6 text-blue-500" />
    </button>
    {tutor.foto && tutor.foto.url ? (
      <img
        src={tutor.foto.url}
        alt={tutor.nome}
        className="w-32 h-32 object-cover rounded-full mb-4 border"
      />
    ) : (
      <div className="w-24 h-24 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-500">
        <Warning className="w-12 h-12" />
      </div>
    )}
    <div className="font-bold text-2xl mb-2">{tutor.nome}</div>
    <div className="text-gray-600 mb-1">
      {labels.email}: {tutor.email}
    </div>
    <div className="text-gray-600 mb-1">
      {labels.phone}: {maskCellPhone(tutor?.telefone ?? '')}
    </div>
    <div className="text-gray-600 mb-1">
      {labels.cpf}: {maskCPF(tutor?.cpf ?? '')}
    </div>
    <div className="text-gray-600 mb-1">
      {labels.address}: {tutor.endereco}
    </div>
  </div>
);

export default TutorDetailsCard;
