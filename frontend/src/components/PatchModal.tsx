// src/components/PatchModal.tsx
import { useState } from 'react';
import { generatePatch } from '../services/api';
import { Button } from './Button';
import { Card } from './Card';
import { Chip } from './Chip';

interface PatchModalProps {
  vulnerability: {
    severity: 'HIGH' | 'MEDIUM';
    message: string;
    file: string;
  };
  onClose: () => void;
}

export function PatchModal({ vulnerability, onClose }: PatchModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [patchDiff, setPatchDiff] = useState('');
  const [error, setError] = useState('');

  const handleGenerateSuggestion = async () => {
    setIsGenerating(true);
    setError('');
    setPatchDiff('');

    try {
      const result = await generatePatch(vulnerability.file, vulnerability.message);
      setPatchDiff(result.patch_diff);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate a suggestion.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0b1d30]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
      <Card className="bg-white max-w-2xl w-full flex flex-col gap-6 p-8 border-[#f8b92a] shadow-xl">
        <div className="flex justify-between items-center border-b border-[#e5e7eb] pb-4">
          <div className="flex items-center gap-3">
            <Chip className={vulnerability.severity === 'HIGH' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}>
              {vulnerability.severity} RISK
            </Chip>
            <span className="font-bold text-[#111827] text-sm">
              // LOCAL MODEL SUGGESTION
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#4b5563] hover:text-[#111827] font-bold cursor-pointer text-lg px-2"
            aria-label="Close suggestion dialog"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-[#111827]">{vulnerability.message}</p>
          <p className="text-xs text-[#4b5563]">
            Target path:{' '}
            <code className="bg-[#f9fafb] px-2 py-0.5 border border-[#e5e7eb] rounded text-[#1d4ed8]">
              {vulnerability.file}
            </code>
          </p>
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-[2px] leading-relaxed">
            The model receives the finding description and file path, not the source file.
            Its output is an unverified suggestion. RepoLens does not apply or write patches.
            Review and test any suggestion manually.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[#6b7280]">
            // MODEL OUTPUT — REVIEW BEFORE USE
          </span>
          <pre className="min-h-32 max-h-72 overflow-auto whitespace-pre-wrap break-words bg-[#0b1d30] text-emerald-300 p-4 rounded-[2px] text-xs leading-relaxed">
            {patchDiff || (error ? 'No suggestion was generated.' : 'No suggestion requested yet.')}
          </pre>
          {error && (
            <p role="alert" className="text-xs text-rose-700">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
          <Button variant="secondary" onClick={onClose} className="h-[40px] text-xs px-4">
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerateSuggestion}
            disabled={isGenerating}
            className="h-[40px] text-xs px-6"
          >
            {isGenerating ? 'Requesting suggestion...' : patchDiff ? 'Regenerate suggestion' : 'Generate suggestion'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
