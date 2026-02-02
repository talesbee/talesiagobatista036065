import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { maskCellPhone, maskCPF } from '../Uteis';
import { PhotoInput, Input, Button } from '../components';
import { useNavigate } from 'react-router-dom';
import { TutorFormData } from '../types';

interface TutorFormProps {
  initialData?: Partial<TutorFormData>;
  currentPhotoUrl?: string;
  onSubmit: (data: TutorFormData) => void;
  isEdit?: boolean;
  isLoading?: boolean;
  onChangePhoto?: (file: File) => void;
  onRemovePhoto?: () => void;
}

const TutorForm: React.FC<TutorFormProps> = ({
  initialData,
  currentPhotoUrl,
  onSubmit,
  isEdit,
  isLoading,
  onChangePhoto,
  onRemovePhoto,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    nome: initialData?.nome || '',
    email: initialData?.email || '',
    telefone: initialData?.telefone ? maskCellPhone(initialData.telefone) : '',
    endereco: initialData?.endereco || '',
    cpf: initialData?.cpf ? maskCPF(initialData.cpf.toString()) : '',
    foto: null as File | null,
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setForm({
      nome: initialData?.nome || '',
      email: initialData?.email || '',
      telefone: initialData?.telefone ? maskCellPhone(initialData.telefone) : '',
      endereco: initialData?.endereco || '',
      cpf: initialData?.cpf ? maskCPF(initialData.cpf.toString()) : '',
      foto: null as File | null,
    });
  }, [
    initialData?.nome,
    initialData?.email,
    initialData?.telefone,
    initialData?.endereco,
    initialData?.cpf,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setIsDirty(true);
    if (name === 'foto' && files && files[0]) {
      setForm((f) => ({ ...f, foto: files[0] }));
    } else if (name === 'telefone') {
      setForm((f) => ({ ...f, telefone: maskCellPhone(value) }));
    } else if (name === 'cpf') {
      setForm((f) => ({ ...f, cpf: maskCPF(value) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      cpf: form.cpf.replace(/\D+/g, ''),
      telefone: form.telefone.replace(/\D+/g, ''),
      foto: form.foto,
    });
  };

  const handlePhotoChange = (file: File) => {
    setForm((prev) => ({ ...prev, foto: file }));
    if (onChangePhoto) onChangePhoto(file);
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
        className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow flex flex-col gap-6 mt-4 relative z-0"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 tracking-tight">
          {isEdit ? t('tutors.editTitle') : t('tutors.createTitle')}
        </h2>
        <div className="flex flex-col gap-4">
          <Input
            label={t('tutors.name')}
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
          <Input
            label={t('tutors.email')}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label={t('tutors.phone')}
            type="text"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            maxLength={16}
            required
          />
          <Input
            label={t('tutors.cpf')}
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            maxLength={14}
            required
          />
          <Input
            label={t('tutors.address')}
            type="text"
            name="endereco"
            value={form.endereco}
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
          onClick={() => navigate('/tutores')}
        >
          {t('petForm.cancel')}
        </Button>
      </div>
    </div>
  );
};

export default TutorForm;
