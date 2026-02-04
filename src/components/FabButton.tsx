import { ReactNode } from 'react';

import PlusIcon from '../assets/PlusIcon.svg?react';

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
          <PlusIcon width={32} height={32} />
        </span>
      </button>
    </div>
  );
}
