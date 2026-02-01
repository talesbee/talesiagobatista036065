import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'confirm' | 'cancel';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  gradient?: boolean;
  variant?: ButtonVariant;
}

export default function Button({
  children,
  gradient = true,
  variant = 'confirm',
  className = '',
  ...props
}: ButtonProps) {
  let base = '';
  if (variant === 'cancel') {
    base = gradient
      ? 'bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white'
      : 'bg-red-600 hover:bg-red-700 text-white';
  } else {
    base = gradient
      ? 'bg-gradient-to-r from-blue-700 to-blue-400 hover:from-blue-800 hover:to-blue-500 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white';
  }
  return (
    <button
      className={`py-2 px-4 rounded font-bold shadow transition ${base} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
