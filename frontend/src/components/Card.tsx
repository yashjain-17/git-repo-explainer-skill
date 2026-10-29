// src/components/Card.tsx
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white border border-[#e5e7eb] shadow-sm rounded-[4px] p-6 ${className}`}>
      {children}
    </div>
  );
}