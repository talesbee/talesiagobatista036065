import { Tutor } from '../types';
import { useTranslation } from 'react-i18next';
import { maskCellPhone, maskCPF } from '../Uteis';
import { Edit, Warning } from '../assets/icons';
import { useNavigate } from 'react-router-dom';

interface CardTutorProps {
  tutor: Tutor;
  onClick?: () => void;
}

export default function CardTutor({ tutor, onClick }: CardTutorProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition relative"
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    >
      <button
        type="button"
        className="absolute top-2 right-2 p-1 rounded-full bg-white shadow hover:bg-gray-100 z-10"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/tutores/${tutor.id}`);
        }}
        aria-label={t('cardTutor.edit')}
      >
        <Edit className="w-6 h-6 text-blue-500" />
      </button>
      {tutor.foto && tutor.foto.url ? (
        <img
          src={tutor.foto.url}
          alt={tutor.nome}
          className="w-24 h-24 object-cover rounded-full mb-2 border"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-500">
          <Warning className="w-12 h-12" />
        </div>
      )}
      <div className="font-bold text-lg mb-1">{tutor.nome}</div>
      {tutor.email && <div className="text-gray-600">{tutor.email}</div>}
      {tutor.telefone && maskCellPhone(tutor.telefone) && (
        <div className="text-gray-600">{maskCellPhone(tutor.telefone)}</div>
      )}
      {tutor.cpf && maskCPF(tutor.cpf) && (
        <div className="text-gray-500 text-sm">
          {t('tutors.cpf')}: {maskCPF(tutor.cpf)}
        </div>
      )}
      {tutor.endereco && (
        <div className="text-gray-500 text-sm">
          {t('tutors.address')}: {tutor.endereco}
        </div>
      )}
    </div>
  );
}
