import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export default function Button({ children, gradient = true, className = '', ...props }: ButtonProps) {
  const base = gradient
    ? 'bg-gradient-to-r from-blue-700 to-blue-400 hover:from-blue-800 hover:to-blue-500 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';
  return (
    <button
      className={`py-2 px-4 rounded font-semibold shadow transition ${base} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
