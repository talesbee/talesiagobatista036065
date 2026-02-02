import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import PetForm from '../components/PetForm';
import {
  deletePetPhoto,
  getPetById,
  postPet,
  putPet,
  uploadPetPhoto,
} from '../services/petService';
import { Pet, PetPayload, PetFormData } from '../types';
import { Modal } from '../components';

const PetDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [pet, setPet] = useState<Pet | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    status: 'success' | 'warning' | 'error' | 'loading';
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ isOpen: false, status: 'success', message: '' });

  useEffect(() => {
    if (isEdit && id) {
      setModal({ isOpen: true, status: 'loading', message: t('petDetails.loading') });
      getPetById(Number(id))
        .then((data) => {
          setPet(data);
          setModal((m) => ({ ...m, isOpen: false }));
        })
        .catch(() => {
          setModal({
            isOpen: true,
            status: 'error',
            message: t('petDetails.errorLoading'),
            onConfirm: () => navigate('/pets'),
          });
        });
    }
  }, [id, isEdit]);

  const handleSubmit = async (data: PetFormData) => {
    setModal({ isOpen: true, status: 'loading', message: t('petDetails.saving') });
    try {
      const payload: PetPayload = {
        nome: data.nome,
        raca: data.raca,
        idade: data.idade,
      };
      let petId: number | undefined = id ? Number(id) : undefined;
      if (isEdit && id) {
        await putPet(Number(id), payload);
      } else {
        const res = await postPet(payload);
        petId = res.id;
      }
      if (data.foto && petId) {
        await uploadPetPhoto(petId, data.foto);
      }
      setModal({ isOpen: true, status: 'success', message: t('petDetails.successSave') });
      setTimeout(() => {
        setModal((m) => ({ ...m, isOpen: false }));
        if (petId) {
          navigate(`/pets/${petId}`);
        } else {
          navigate('/pets');
        }
      }, 2000);
    } catch (e) {
      setModal({ isOpen: true, status: 'error', message: t('petDetails.errorSave') });
    }
  };

  const handleChangePhoto = (file: File) => {
    if (!pet && !isEdit) return;
    if (id) {
      setModal({
        isOpen: true,
        status: 'warning',
        message: t('petDetails.confirmChangePhoto'),
        onConfirm: async () => {
          setModal({ isOpen: true, status: 'loading', message: t('petDetails.sendingPhoto') });
          try {
            await uploadPetPhoto(Number(id), file);
            const updated = await getPetById(Number(id));
            setPet(updated);
            setModal({ isOpen: true, status: 'success', message: t('petDetails.successPhoto') });
            setTimeout(() => setModal((m) => ({ ...m, isOpen: false })), 2000);
          } catch (e) {
            setModal({ isOpen: true, status: 'error', message: t('petDetails.errorPhoto') });
          }
        },
        onCancel: () => setModal((m) => ({ ...m, isOpen: false })),
      });
    }
  };

  const handleRemovePhoto = () => {
    if (!pet || !pet.foto?.id || !id) return;
    setModal({
      isOpen: true,
      status: 'warning',
      message: t('petDetails.confirmRemovePhoto'),
      onConfirm: async () => {
        if (!pet || !pet.foto?.id) return;
        setModal({ isOpen: true, status: 'loading', message: t('petDetails.removingPhoto') });
        try {
          await deletePetPhoto(Number(id), pet.foto.id);
          const updated = await getPetById(Number(id));
          setPet(updated);
          setModal({
            isOpen: true,
            status: 'success',
            message: t('petDetails.successRemovePhoto'),
          });
          setTimeout(() => setModal((m) => ({ ...m, isOpen: false })), 2000);
        } catch (e) {
          setModal({ isOpen: true, status: 'error', message: t('petDetails.errorRemovePhoto') });
        }
      },
      onCancel: () => setModal((m) => ({ ...m, isOpen: false })),
    });
  };

  return (
    <div className="container mx-auto py-6">
      {isEdit && pet ? (
        <PetForm
          initialData={{
            nome: pet.nome,
            idade: pet.idade ?? 0,
            raca: pet.raca ?? '',
            foto: null,
          }}
          currentPhotoUrl={pet.foto?.url}
          onSubmit={handleSubmit}
          isEdit
          isLoading={modal.status === 'loading'}
          onChangePhoto={handleChangePhoto}
          onRemovePhoto={handleRemovePhoto}
        />
      ) : (
        <PetForm onSubmit={handleSubmit} isLoading={modal.status === 'loading'} />
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

export default PetDetails;
