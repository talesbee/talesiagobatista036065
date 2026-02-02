import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Close, Upload, Warning } from '../assets/icons';

interface PhotoInputProps {
  currentPhotoUrl?: string;
  photoFile?: File | null;
  onChangePhoto: (file: File) => void;
  onRemovePhoto: () => void;
}

const PhotoInput: React.FC<PhotoInputProps> = ({
  currentPhotoUrl,
  photoFile,
  onChangePhoto,
  onRemovePhoto,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onChangePhoto(file);
    }
  };

  const handleRemovePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemovePhoto();
  };

  return (
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
        {currentPhotoUrl || photoFile ? (
          <img
            src={currentPhotoUrl || (photoFile ? URL.createObjectURL(photoFile) : undefined)}
            alt={t('petForm.photoAlt')}
            className="w-36 h-36 object-cover rounded-full border-4 border-white shadow-lg bg-gray-100"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
          />
        ) : (
          <div className="w-36 h-36 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-500">
            <Warning className="w-20 h-20" />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />

        {!currentPhotoUrl && !photoFile && (
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
        {(currentPhotoUrl || photoFile) && (
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
                onClick={handleRemovePhoto}
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
  );
};

export default PhotoInput;
