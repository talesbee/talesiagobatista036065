import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  containerClassName = 'flex flex-col gap-1 text-base font-medium text-gray-700',
  labelClassName = '',
  inputClassName = 'input input-bordered px-3 py-2 ml-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300',
  ...props
}) => {
  console.log('Rendering Input:', { label, props });
  return (
    <label className={containerClassName}>
      <span className={labelClassName}>{label}</span>
      <input className={inputClassName} {...props} />
    </label>
  );
};

export default Input;
