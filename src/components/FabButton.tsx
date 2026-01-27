import { ReactNode } from 'react';
import PlusIcon from '../assets/PlusIcon.svg';

interface FabButtonProps {
  open: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

export function FabButton({ open, onToggle, children }: FabButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && <div className="mb-2 flex flex-col gap-2 animate-fade-in">{children}</div>}
      <button
        className={`flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-3xl w-16 h-16 transition-transform ${open ? 'rotate-45' : ''}`}
        onClick={onToggle}
        aria-label="Abrir opções de adicionar"
        type="button"
      >
        <span className="flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="16" fill="currentColor" fill-opacity="0" />
            <rect x="14" y="4" width="4" height="24" rx="2" fill="currentColor" />
            <rect x="4" y="14" width="24" height="4" rx="2" fill="currentColor" />
          </svg>
        </span>
      </button>
    </div>
  );
}
