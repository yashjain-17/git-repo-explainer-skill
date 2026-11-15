// src/components/ExportToolbar.tsx
import { useState } from 'react';
import { Button } from './Button';

interface ExportToolbarProps {
  reportContent: string;
}

export function ExportToolbar({ reportContent }: ExportToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  const handleCopy = async () => {
    setCopied(false);
    setCopyError('');

    try {
      await navigator.clipboard.writeText(reportContent);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError('Clipboard access was blocked. Copy the report manually instead.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'architecture-report.md';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex flex-col gap-2 items-end w-full pt-2">
      <div className="flex gap-4 items-center justify-end w-full">
        <Button variant="secondary" className="h-[40px] text-xs px-4" onClick={handleCopy}>
          {copied ? 'COPIED TO CLIPBOARD ✓' : 'COPY REPORT'}
        </Button>
        <Button variant="primary" className="h-[40px] text-xs px-4" onClick={handleDownload}>
          DOWNLOAD MARKDOWN ↓
        </Button>
      </div>
      {copyError && (
        <p role="alert" className="text-xs text-rose-700">
          {copyError}
        </p>
      )}
    </div>
  );
}
