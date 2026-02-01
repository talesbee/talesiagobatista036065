import React from 'react';
import { Error, Loading, Success, Warning } from '../assets/icons';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  status?: 'success' | 'warning' | 'error' | 'loading';
}

const statusColors = {
  success: 'text-green-800',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  loading: 'text-gray-600',
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  status = 'success',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {title && <h2 className={`text-xl font-semibold mb-2 ${statusColors[status]}`}>{title}</h2>}
        <div className="flex justify-center mb-2">
          {status === 'success' && <Success className="w-20 h-20 text-green-800" />}
          {status === 'error' && <Error className="w-20 h-20 text-red-600" />}
          {status === 'warning' && <Warning className="w-20 h-20 text-yellow-600" />}
        </div>
        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center mb-4">
            <span className="inline-block animate-spin mb-2">
              <Loading className="w-20 h-20" />
            </span>
            <span className="text-gray-700 text-base text-center">{message}</span>
          </div>
        ) : (
          <p className="mb-4 text-gray-700 text-center">{message}</p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          {status !== 'loading' && onCancel && (
            <Button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={onCancel}
              variant="cancel"
            >
              {cancelText}
            </Button>
          )}
          {status !== 'loading' && onConfirm && (
            <Button variant={'confirm'} onClick={onConfirm}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
