import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTutorById, unlinkTutorPet } from '../services/tutorService';
import { Tutor } from '../types';
import { Button } from '../components';
import TutorDetailsCard from '../components/TutorDetailsCard';
import TutorPetsList from '../components/TutorPetsList';

type ModalStatus = 'success' | 'warning' | 'error' | 'loading';
interface ModalState {
  isOpen: boolean;
  status: ModalStatus;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const TutorView: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, status: 'success', message: '' });

  const labels = {
    loading: t('tutors.loading'),
    notFound: t('tutors.notFound', 'Tutor não encontrado'),
    edit: t('tutors.edit', 'Editar'),
    name: t('tutors.name'),
    email: t('tutors.email'),
    phone: t('tutors.phone'),
    cpf: t('tutors.cpf'),
    address: t('tutors.address'),
    back: t('petForm.cancel'),
    petsTitle: t('tutorDetails.petsTitle', 'Pets do Tutor'),
    removePet: t('tutorDetails.removePet', 'Remover vínculo do pet'),
    confirmRemoveTutor: t(
      'tutorDetails.confirmRemoveTutor',
      'Tem certeza que deseja remover o vínculo deste pet?',
    ),
    removingTutor: t('tutorDetails.removingTutor', 'Removendo vínculo do pet...'),
    successRemoveTutor: t(
      'tutorDetails.successRemoveTutor',
      'Vínculo do pet removido com sucesso!',
    ),
    errorRemoveTutor: t('tutorDetails.errorRemoveTutor', 'Erro ao remover vínculo do pet.'),
  };

  // Modal helpers
  const openModal = (
    status: ModalStatus,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
  ) => {
    setModal({ isOpen: true, status, message, onConfirm, onCancel });
  };
  const closeModal = () => setModal((m) => ({ ...m, isOpen: false }));

  // Remover vínculo do pet
  const handleRemovePet = (petId: number) => {
    openModal(
      'warning',
      labels.confirmRemoveTutor,
      async () => {
        if (!id) return;
        setModal({ isOpen: true, status: 'loading', message: labels.removingTutor });
        try {
          await unlinkTutorPet(Number(id), petId);
          const updated = await getTutorById(Number(id));
          setTutor(updated);
          setModal({ isOpen: true, status: 'success', message: labels.successRemoveTutor });
          setTimeout(() => closeModal(), 2000);
        } catch (e) {
          setModal({ isOpen: true, status: 'error', message: labels.errorRemoveTutor });
        }
      },
      closeModal,
    );
  };

  // Editar tutor
  const handleEdit = () => {
    if (tutor) navigate(`/tutores/${tutor.id}`);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getTutorById(Number(id))
        .then((data) => {
          setTutor(data);
          setLoading(false);
        })
        .catch(() => {
          setTutor(null);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-1 min-h-[26vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-blue-700 font-medium mt-2">{labels.loading}</span>
        </div>
      </div>
    );
  if (!tutor) return <div className="p-4 text-red-500">{labels.notFound}</div>;

  return (
    <div className="container mx-auto py-6 max-w-xl">
      <TutorDetailsCard tutor={tutor} labels={labels} onEdit={handleEdit} />
      {tutor.pets && tutor.pets.length > 0 && (
        <TutorPetsList pets={tutor.pets} onRemove={handleRemovePet} labels={labels} />
      )}
      <div className="flex justify-center mt-4">
        <Button variant="cancel" onClick={() => navigate(-1)}>
          {labels.back}
        </Button>
      </div>
    </div>
  );
};

export default TutorView;
