import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { tutorFacade } from '../state/TutorFacade';
import { Tutor, TutorPayload } from '../types';
import { Modal, TutorForm } from '../components';

const TutorDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    status: 'success' | 'warning' | 'error' | 'loading';
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ isOpen: false, status: 'success', message: '' });

  useEffect(() => {
    if (isEdit && id) {
      setModal({ isOpen: true, status: 'loading', message: t('tutorDetails.loading') });
      tutorFacade
        .getTutorById(Number(id))
        .then((data) => {
          setTutor(data);
          setModal((m) => ({ ...m, isOpen: false }));
        })
        .catch(() => {
          setModal({
            isOpen: true,
            status: 'error',
            message: t('tutorDetails.errorLoading'),
            onConfirm: () => navigate('/tutores'),
          });
        });
    }
  }, [id, isEdit, t, navigate]);

  const handleSubmit = (data: {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: string;
    foto?: File | null;
  }) => {
    (async () => {
      setModal({ isOpen: true, status: 'loading', message: t('tutorDetails.saving') });
      try {
        let tutorId: number | undefined = id ? Number(id) : undefined;
        const payload: TutorPayload = {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          endereco: data.endereco,
          cpf: Number(data.cpf),
        };
        if (isEdit && id) {
          const updated = await tutorFacade.updateTutor(Number(id), payload as any);
          tutorId = updated.id;
        } else {
          const res = await tutorFacade.createTutor(payload as any);
          tutorId = res.id;
        }
        if (data.foto && tutorId) {
          await tutorFacade.uploadPhoto(tutorId, data.foto as File);
        }
        setModal({ isOpen: true, status: 'success', message: t('tutorDetails.successSave') });
        setTimeout(() => {
          setModal((m) => ({ ...m, isOpen: false }));
          if (tutorId) {
            navigate(`/tutores/${tutorId}`);
          } else {
            navigate('/tutores');
          }
        }, 2000);
      } catch (e) {
        setModal({
          isOpen: true,
          status: 'error',
          message: t('tutorDetails.errorSave'),
          onConfirm: () => navigate('/tutores'),
        });
      }
    })();
  };

  const handleChangePhoto = (file: File) => {
    if (!tutor && !isEdit) return;
    if (id) {
      setModal({
        isOpen: true,
        status: 'warning',
        message: t('tutorDetails.confirmChangePhoto'),
        onConfirm: async () => {
          setModal({ isOpen: true, status: 'loading', message: t('tutorDetails.sendingPhoto') });
          try {
            await tutorFacade.uploadPhoto(Number(id), file);
            const updated = await tutorFacade.getTutorById(Number(id));
            setTutor(updated);
            setModal({ isOpen: true, status: 'success', message: t('tutorDetails.successPhoto') });
            setTimeout(() => setModal((m) => ({ ...m, isOpen: false })), 2000);
          } catch (e) {
            setModal({ isOpen: true, status: 'error', message: t('tutorDetails.errorPhoto') });
          }
        },
        onCancel: () => setModal((m) => ({ ...m, isOpen: false })),
      });
    }
  };

  const handleRemovePhoto = () => {
    if (!tutor || !tutor.foto?.id || !id) return;
    setModal({
      isOpen: true,
      status: 'warning',
      message: t('tutorDetails.confirmRemovePhoto'),
      onConfirm: async () => {
        if (!tutor || !tutor.foto?.id) return;
        setModal({ isOpen: true, status: 'loading', message: t('tutorDetails.removingPhoto') });
        try {
          await tutorFacade.deletePhoto(Number(id), tutor.foto.id);
          const updated = await tutorFacade.getTutorById(Number(id));
          setTutor(updated);
          setModal({
            isOpen: true,
            status: 'success',
            message: t('tutorDetails.successRemovePhoto'),
          });
          setTimeout(() => setModal((m) => ({ ...m, isOpen: false })), 2000);
        } catch (e) {
          setModal({ isOpen: true, status: 'error', message: t('tutorDetails.errorRemovePhoto') });
        }
      },
      onCancel: () => setModal((m) => ({ ...m, isOpen: false })),
    });
  };

  return (
    <div className="container mx-auto py-6">
      {isEdit && tutor ? (
        <TutorForm
          initialData={{
            nome: tutor.nome,
            email: tutor.email,
            telefone: tutor.telefone,
            endereco: tutor.endereco,
            cpf: String(tutor.cpf),
            foto: null,
          }}
          currentPhotoUrl={tutor.foto?.url}
          onSubmit={handleSubmit}
          isEdit
          isLoading={modal.status === 'loading'}
          onChangePhoto={handleChangePhoto}
          onRemovePhoto={handleRemovePhoto}
        />
      ) : (
        <TutorForm onSubmit={handleSubmit} isLoading={modal.status === 'loading'} />
      )}
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

export default TutorDetails;
