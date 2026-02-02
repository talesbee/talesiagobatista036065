import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPetById, deletePetPhoto } from '../services/petService';
import { unlinkTutorPet } from '../services/tutorService';
import { Pet } from '../types';
import { Button, Modal } from '../components';
import { Warning, Edit } from '../assets/icons';
import TutorListItem from '../components/TutorListItem';

type ModalStatus = 'success' | 'warning' | 'error' | 'loading';
interface ModalState {
  isOpen: boolean;
  status: ModalStatus;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const PetView: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, status: 'success', message: '' });

  const labels = {
    errorLoading: t('petDetails.errorLoading'),
    loading: t('petDetails.loading'),
    notFound: t('petDetails.notFound'),
    edit: t('petDetails.edit'),
    breed: t('cardPet.breed'),
    age: t('cardPet.age'),
    tutorsTitle: t('petDetails.tutorsTitle'),
    removeTutor: t('petDetails.removeTutor'),
    confirmRemoveTutor: t('petDetails.confirmRemoveTutor'),
    removingTutor: t('petDetails.removingTutor'),
    successRemoveTutor: t('petDetails.successRemoveTutor'),
    errorRemoveTutor: t('petDetails.errorRemoveTutor'),
    back: t('petDetails.back'),
  };

  const openModal = (
    status: ModalStatus,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
  ) => {
    setModal({ isOpen: true, status, message, onConfirm, onCancel });
  };
  const closeModal = () => setModal((m) => ({ ...m, isOpen: false }));

  const handleRemoveTutor = (tutorId: number) => {
    openModal(
      'warning',
      labels.confirmRemoveTutor,
      async () => {
        if (!id) return;
        setModal({ isOpen: true, status: 'loading', message: labels.removingTutor });
        try {
          await unlinkTutorPet(tutorId, Number(id));
          const updated = await getPetById(Number(id));
          setPet(updated);
          setModal({ isOpen: true, status: 'success', message: labels.successRemoveTutor });
          setTimeout(() => closeModal(), 2000);
        } catch (e) {
          setModal({ isOpen: true, status: 'error', message: labels.errorRemoveTutor });
        }
      },
      closeModal,
    );
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getPetById(Number(id))
        .then((data) => {
          setPet(data);
          setLoading(false);
        })
        .catch(() => {
          openModal('error', labels.errorLoading, () => navigate('/pets'));
          setLoading(false);
        });
    }
  }, [id, t]);

  if (loading)
    return (
      <div className="flex flex-1 min-h-[26vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-blue-700 font-medium mt-2">{labels.loading}</span>
        </div>
      </div>
    );
  if (!pet) return <div className="p-4 text-red-500">{labels.notFound}</div>;

  return (
    <div className="container mx-auto py-6 max-w-xl">
      <div className="bg-white rounded shadow p-6 flex flex-col items-center relative">
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded-full bg-white shadow hover:bg-gray-100 z-10"
          onClick={() => navigate(`/pets/${pet.id}`)}
          aria-label={t('petDetails.edit')}
        >
          <Edit className="w-6 h-6 text-blue-500" />
        </button>
        {pet.foto && pet.foto.url ? (
          <img
            src={pet.foto.url}
            alt={pet.nome}
            className="w-32 h-32 object-cover rounded-full mb-4 border"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-500">
            <Warning className="w-12 h-12" />
          </div>
        )}
        <div className="font-bold text-2xl mb-2">{pet.nome}</div>
        <div className="text-gray-600 mb-1">
          {t('cardPet.breed')}: {pet.raca}
        </div>
        <div className="text-gray-500 mb-1">
          {t('cardPet.age')}: {pet.idade ?? '-'}
        </div>
      </div>

      {pet.tutores && pet.tutores.length > 0 && (
        <div className="mt-8 w-full">
          <div className="font-semibold text-lg mb-3">{labels.tutorsTitle}</div>
          <ul className="flex flex-col gap-4">
            {pet.tutores.map((tutor) => (
              <TutorListItem
                key={tutor.id}
                tutor={tutor}
                onRemove={() => handleRemoveTutor(tutor.id)}
                removeLabel={labels.removeTutor}
              />
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Button variant="cancel" onClick={() => navigate(-1)}>
          {labels.back}
        </Button>
      </div>
      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        status={modal.status}
        onCancel={modal.onCancel}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default PetView;
