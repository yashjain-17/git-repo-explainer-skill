import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = "font-mono font-bold transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50";
  
  const variants = {
    primary: "bg-[#f8b92a] text-[#0b1d30] hover:bg-[#f2ae1f] rounded-[2px] px-6 h-[68px] text-[18px]",
    secondary: "bg-[#fafafa] text-[#242425] border border-[#f1f2f3] hover:bg-gray-100 rounded-[2px] px-6 h-[68px] text-[18px]",
    link: "bg-transparent text-[#242425] underline-offset-4 hover:underline p-0 text-[16px]"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}