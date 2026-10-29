// src/components/PatchModal.tsx
import { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Chip } from './Chip';

interface PatchModalProps {
  vulnerability: {
    severity: 'HIGH' | 'MED' | 'LOW';
    message: string;
    file: string;
  };
  onClose: () => void;
}

export function PatchModal({ vulnerability, onClose }: PatchModalProps) {
  const [isPatching, setIsPatching] = useState(false);
  const [patched, setPatched] = useState(false);

  const handleApplyPatch = () => {
    setIsPatching(true);
    setTimeout(() => {
      setIsPatching(false);
      setPatched(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-[#0b1d30]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
      <Card className="bg-white max-w-2xl w-full flex flex-col gap-6 p-8 border-[#f8b92a] shadow-xl">
        <div className="flex justify-between items-center border-b border-[#e5e7eb] pb-4">
          <div className="flex items-center gap-3">
            <Chip className={vulnerability.severity === 'HIGH' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}>
              {vulnerability.severity} RISK
            </Chip>
            <span className="font-bold text-[#111827] text-sm">// VULNERABILITY REMEDIATION</span>
          </div>
          <button onClick={onClose} className="text-[#4b5563] hover:text-[#111827] font-bold cursor-pointer text-lg px-2">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-[#111827]">{vulnerability.message}</p>
          <p className="text-xs text-[#4b5563]">Target File: <code className="bg-[#f9fafb] px-2 py-0.5 border border-[#e5e7eb] rounded text-[#1d4ed8]">{vulnerability.file}</code></p>
        </div>

        {/* Code Diff Box */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[#6b7280]">// SUGGESTED SECURE CODE DIFF</span>
          <div className="bg-[#0b1d30] text-emerald-400 p-4 rounded-[2px] text-xs font-mono leading-relaxed overflow-x-auto">
            {!patched ? (
              <>
                <div className="text-rose-400">- raw_input = sys.argv[1] # Unsanitized input risk</div>
                <div className="text-rose-400">- execute_query(raw_input)</div>
                <div className="text-emerald-400 mt-2">+ # Secure Sanitized AST Guard</div>
                <div className="text-emerald-400">+ from repolens.security import sanitize_cli_arg</div>
                <div className="text-emerald-400">+ clean_arg = sanitize_cli_arg(sys.argv[1])</div>
                <div className="text-emerald-400">+ execute_query(clean_arg)</div>
              </>
            ) : (
              <div className="text-emerald-300 font-bold py-2">✓ Patch successfully compiled and injected into local workspace tree!</div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
          <Button variant="secondary" onClick={onClose} className="h-[40px] text-xs px-4">
            Close
          </Button>
          {!patched && (
            <Button 
              variant="primary" 
              onClick={handleApplyPatch} 
              disabled={isPatching}
              className="h-[40px] text-xs px-6"
            >
              {isPatching ? 'Synthesizing Patch...' : 'Apply Secure Patch ⚡'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}