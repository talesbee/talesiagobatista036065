import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { PetFormData } from '../types';

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
      {/* Foto do pet, centralizada e circular, fora do card */}
      {isEdit && currentPhotoUrl && (
        <div className="flex flex-col items-center w-full mb-2">
          <img
            src={currentPhotoUrl}
            alt="Foto do Pet"
            className="w-36 h-36 object-cover rounded-full border-4 border-white shadow-lg bg-gray-100"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
          />
          <div className="flex flex-row justify-center gap-4 mt-3 w-full">
            <button
              type="button"
              className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              Trocar foto
            </button>
            <button
              type="button"
              className="px-4 py-1.5 rounded-full bg-red-500 text-white text-sm font-medium shadow hover:bg-red-600 transition"
              onClick={onRemovePhoto}
            >
              Remover foto
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow flex flex-col gap-6 mt-4 relative z-0"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 tracking-tight">
          {isEdit ? 'Editar Pet' : 'Cadastrar Pet'}
        </h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Nome
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="input input-bordered px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Idade
            <input
              type="number"
              name="idade"
              value={form.idade}
              onChange={handleChange}
              min={0}
              required
              className="input input-bordered px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Raça
            <input
              type="text"
              name="raca"
              value={form.raca}
              onChange={handleChange}
              required
              className="input input-bordered px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
            />
          </label>
          {/* Input de foto só aparece se não houver foto ou se for cadastro */}
          {(!isEdit || !initialData.foto) && (
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Foto
              <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
            </label>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-4 py-2 text-base font-semibold"
          disabled={isLoading}
        >
          {isEdit ? 'Salvar Alterações' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

export default PetForm;
