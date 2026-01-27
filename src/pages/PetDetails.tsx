import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PetForm from '../components/PetForm';
import { getPetById, postPet, putPet, uploadPetPhoto } from '../services/petService';
import { Pet, PetPayload, PetFormData } from '../types';

const PetDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getPetById(Number(id))
        .then((data) => setPet(data))
        .catch(() => setError('Erro ao carregar dados do pet.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (data: PetFormData) => {
    setLoading(true);
    setError(null);
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
      if (petId) {
        navigate(`/pets/${petId}`);
      }
    } catch (e) {
      setError('Erro ao salvar pet.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !pet && isEdit) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
          isLoading={loading}
        />
      ) : (
        <PetForm onSubmit={handleSubmit} isLoading={loading} />
      )}
    </div>
  );
};

export default PetDetails;
