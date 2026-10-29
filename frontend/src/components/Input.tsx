// src/components/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="font-mono text-[12px] font-bold uppercase tracking-wider text-[#242425]">
          {label}
        </label>
      )}
      <input
        className={`bg-[#fafafa] text-[#242425] border border-[#f1f2f3] font-mono text-[14px] rounded-[2px] px-6 py-4 focus:outline-none focus:border-[#f8b92a] ${className}`}
        {...props}
      />
    </div>
  );
}