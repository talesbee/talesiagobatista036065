import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PetFormData } from '../types';
import { useNavigate } from 'react-router-dom';
import { PhotoInput, Input, Button } from '../components';

interface PetFormProps {
  initialData?: Partial<PetFormData>;
  currentPhotoUrl?: string;
  onSubmit: (data: PetFormData) => void;
  isEdit?: boolean;
  isLoading?: boolean;
  onRemovePhoto?: () => void;
  onChangePhoto?: (file: File) => void;
}

const PetForm: React.FC<PetFormProps> = ({
  initialData = {},
  currentPhotoUrl,
  onSubmit,
  isEdit = false,
  isLoading = false,
  onRemovePhoto,
  onChangePhoto,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState<PetFormData>({
    nome: initialData.nome || '',
    idade: initialData.idade || 0,
    raca: initialData.raca || '',
    foto: null,
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setForm({
      nome: initialData.nome || '',
      idade: initialData.idade || 0,
      raca: initialData.raca || '',
      foto: null,
    });
  }, [initialData.nome, initialData.idade, initialData.raca]);

  const handlePhotoChange = (file: File) => {
    setForm((prev) => ({ ...prev, foto: file }));
    if (onChangePhoto) onChangePhoto(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'idade' ? Number(value) : value }));
    setIsDirty(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setIsDirty(false);
  };

  const handleRemovePhoto = () => {
    setForm((prev) => ({ ...prev, foto: null }));
    if (onRemovePhoto) onRemovePhoto();
  };

  return (
    <div className="flex flex-col items-center min-h-[600px] relative">
      <PhotoInput
        currentPhotoUrl={currentPhotoUrl}
        photoFile={form.foto}
        onChangePhoto={handlePhotoChange}
        onRemovePhoto={handleRemovePhoto}
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow flex flex-col gap-6 mt-4 relative z-0"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 tracking-tight">
          {isEdit ? t('petForm.editTitle') : t('petForm.createTitle')}
        </h2>
        <div className="flex flex-col gap-4">
          <Input
            label={t('petForm.name')}
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
          <Input
            label={t('petForm.age')}
            type="number"
            name="idade"
            value={form.idade}
            onChange={handleChange}
            min={0}
            required
          />
          <Input
            label={t('petForm.breed')}
            type="text"
            name="raca"
            value={form.raca}
            onChange={handleChange}
            required
          />
        </div>

        <Button
          type="submit"
          variant="confirm"
          className="btn btn-primary py-2 text-base font-bold"
          disabled={isEdit && !isDirty}
        >
          {isEdit ? t('petForm.save') : t('petForm.register')}
        </Button>
      </form>
      <div className="mt-4">
        <Button
          type="button"
          variant="cancel"
          className="btn btn-secondary py-2 text-base font-bold"
          onClick={() => navigate('/pets')}
        >
          {t('petForm.cancel')}
        </Button>
      </div>
    </div>
  );
};

export default PetForm;
