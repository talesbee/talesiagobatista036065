import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  gradient?: boolean;
  variant?: 'confirm' | 'cancel' | 'warning';
}

export default function Button({
  children,
  gradient = true,
  variant = 'confirm',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  let base = '';
  if (variant === 'cancel') {
    base = gradient
      ? 'bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white'
      : 'bg-red-600 hover:bg-red-700 text-white';
  } else if (variant === 'warning') {
    base = gradient
      ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-700 hover:to-yellow-500 text-white'
      : 'bg-yellow-500 hover:bg-yellow-600 text-white';
  } else {
    base = gradient
      ? 'bg-gradient-to-r from-blue-700 to-blue-400 hover:from-blue-800 hover:to-blue-500 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white';
  }

  return (
    <button
      disabled={disabled}
      className={`py-2 px-4 rounded font-bold shadow transition ${base} ${className}${disabled ? ' opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
