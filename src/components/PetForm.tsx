import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PetFormData } from '../types';
import Pet_default from '../assets/pet_default.png';
import { Close, Upload } from '../assets/icons';
import Button from './Button';

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
  const { t } = useTranslation();
  const [form, setForm] = useState<PetFormData>({
    nome: initialData.nome || '',
    idade: initialData.idade || 0,
    raca: initialData.raca || '',
    foto: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'idade' ? Number(value) : value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, foto: e.target.files![0] }));
      if (onChangePhoto) onChangePhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="flex flex-col items-center min-h-[600px] relative">
      <div className="flex flex-row items-center justify-center w-full mb-2 relative">
        <div className="flex-1 flex justify-end pr-4">
          {currentPhotoUrl && (
            <div className="invisible flex flex-col gap-3 items-center">
              <button className="p-2" aria-label="invisible" />
              <button className="p-2" aria-label="invisible" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center relative">
          <img
            src={currentPhotoUrl || Pet_default}
            alt={t('petForm.photoAlt')}
            className="w-36 h-36 object-cover rounded-full border-4 border-white shadow-lg bg-gray-100"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
          />

          {!currentPhotoUrl && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group flex items-center">
              <button
                type="button"
                className="bg-gray-700/40 rounded-full p-4 flex items-center justify-center hover:bg-gray-700/60 transition"
                style={{ backdropFilter: 'blur(2px)' }}
                onClick={() => fileInputRef.current?.click()}
                aria-label={t('petForm.addPhoto')}
              >
                <Upload className="w-8 h-8" />
              </button>
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                {t('petForm.addPhoto')}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 flex justify-start pl-4">
          {currentPhotoUrl && (
            <div className="flex flex-col gap-3 items-center">
              <div className="relative group flex items-center">
                <button
                  type="button"
                  className="bg-white/80 hover:bg-blue-600/80 text-blue-600 hover:text-white rounded-full p-2 shadow transition flex items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={t('petForm.changePhoto')}
                >
                  <Upload className="w-8 h-8" />
                </button>
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                  {t('petForm.changePhoto')}
                </span>
              </div>
              <div className="relative group flex items-center">
                <button
                  type="button"
                  className="bg-white/80 hover:bg-red-500/80 text-red-500 hover:text-white rounded-full p-2 shadow transition flex items-center justify-center"
                  onClick={onRemovePhoto}
                  aria-label={t('petForm.removePhoto')}
                >
                  <Close className="w-8 h-8" />
                </button>
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                  {t('petForm.removePhoto')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow flex flex-col gap-6 mt-4 relative z-0"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 tracking-tight">
          {isEdit ? t('petForm.editTitle') : t('petForm.createTitle')}
        </h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-base font-medium text-gray-700">
            {t('petForm.name')}
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="input input-bordered px-3 py-2 ml-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300 "
            />
          </label>
          <label className="flex flex-col gap-1 text-base font-medium text-gray-700">
            {t('petForm.age')}
            <input
              type="number"
              name="idade"
              value={form.idade}
              onChange={handleChange}
              min={0}
              required
              className="input input-bordered px-3 py-2 ml-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
            />
          </label>
          <label className="flex flex-col gap-1 text-base font-medium text-gray-700">
            {t('petForm.breed')}
            <input
              type="text"
              name="raca"
              value={form.raca}
              onChange={handleChange}
              required
              className="input input-bordered px-3 py-2 ml-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
            />
          </label>
        </div>

        <Button
          type="submit"
          variant="confirm"
          className="btn btn-primary py-2 text-base font-bold"
          disabled={isLoading}
        >
          {isEdit ? t('petForm.save') : t('petForm.register')}
        </Button>
      </form>
      <div className="mt-4">
        <Button
          type="button"
          variant="cancel"
          className="btn btn-secondary py-2 text-base font-bold"
          onClick={() => window.history.back()}
        >
          {t('petForm.cancel')}
        </Button>
      </div>
    </div>
  );
};

export default PetForm;
