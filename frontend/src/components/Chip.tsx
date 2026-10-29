// src/components/Chip.tsx
import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  className?: string;
}

export function Chip({ children, className = '' }: ChipProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-[2px] font-mono text-[12px] font-bold tracking-wide bg-[#f8b92a] text-[#0b1d30] ${className}`}>
      {children}
    </span>
  );
}