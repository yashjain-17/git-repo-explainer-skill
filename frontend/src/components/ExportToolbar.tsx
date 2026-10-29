// src/components/ExportToolbar.tsx
import { useState } from 'react';
import { Button } from './Button';

interface ExportToolbarProps {
  reportContent: string;
}

export function ExportToolbar({ reportContent }: ExportToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'architecture-report.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-4 items-center justify-end w-full pt-2">
      <Button variant="secondary" className="h-[40px] text-xs px-4" onClick={handleCopy}>
        {copied ? 'COPIED TO CLIPBOARD ✓' : 'COPY REPORT'}
      </Button>
      <Button variant="primary" className="h-[40px] text-xs px-4" onClick={handleDownload}>
        DOWNLOAD MARKDOWN ↓
      </Button>
    </div>
  );
}