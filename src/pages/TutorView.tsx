import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tutorFacade } from '../state/TutorFacade';
import { Tutor } from '../types';
import {
  Button,
  FabButton,
  Modal,
  TutorDetailsCard,
  TutorPetsList,
  PetSelectModal,
} from '../components';

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
  const [fabOpen, setFabOpen] = useState(false);
  const [petModalOpen, setPetModalOpen] = useState(false);

  const labels = {
    loading: t('tutors.loading'),
    notFound: t('tutors.notFound'),
    edit: t('tutors.edit'),
    name: t('tutors.name'),
    email: t('tutors.email'),
    phone: t('tutors.phone'),
    cpf: t('tutors.cpf'),
    address: t('tutors.address'),
    back: t('petDetails.back'),
    petsTitle: t('tutorDetails.petsTitle'),
    removePet: t('tutorDetails.removePet'),
    confirmRemoveTutor: t('tutorDetails.confirmRemoveTutor'),
    removingTutor: t('tutorDetails.removingTutor'),
    successRemoveTutor: t('tutorDetails.successRemoveTutor'),
    errorRemoveTutor: t('tutorDetails.errorRemoveTutor'),
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

  const handleRemovePet = (petId: number) => {
    openModal(
      'warning',
      labels.confirmRemoveTutor,
      async () => {
        if (!id) return;
        setModal({ isOpen: true, status: 'loading', message: labels.removingTutor });
        try {
          await tutorFacade.unlinkTutorPet(Number(id), petId);
          const updated = await tutorFacade.getTutorById(Number(id));
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

  const handleEdit = () => {
    if (tutor) navigate(`/tutores/${tutor.id}`);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      tutorFacade
        .getTutorById(Number(id))
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
      <FabButton open={fabOpen} onToggle={() => setFabOpen((prev) => !prev)}>
        <Button variant="confirm" onClick={() => setPetModalOpen(true)}>
          {t('petSelect.link')}
        </Button>
      </FabButton>
      <div className="flex justify-center mt-4">
        <Button variant="warning" onClick={() => navigate(-1)}>
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
      <PetSelectModal
        isOpen={petModalOpen}
        onClose={() => setPetModalOpen(false)}
        tutorId={tutor.id}
        petsLinked={tutor.pets}
        onLinked={async () => {
          if (!id) return;
          const updated = await tutorFacade.getTutorById(Number(id));
          setTutor(updated);
        }}
      />
    </div>
  );
};

export default TutorView;
