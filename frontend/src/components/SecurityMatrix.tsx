// src/components/SecurityMatrix.tsx
import { useState } from 'react';
import { Card } from './Card';
import { Chip } from './Chip';
import { PatchModal } from './PatchModal';

interface Vulnerability {
  severity: 'HIGH' | 'MEDIUM';
  message: string;
  file: string;
}

interface SecurityMatrixProps {
  vulnerabilities: Vulnerability[];
}

export function SecurityMatrix({ vulnerabilities }: SecurityMatrixProps) {
  const [selectedFinding, setSelectedFinding] = useState<Vulnerability | null>(null);

  return (
    <>
      <Card className="flex flex-col gap-4 bg-white border-[#e5e7eb] shadow-sm">
        <div className="flex justify-between items-center border-b border-[#e5e7eb] pb-3">
          <span className="font-mono font-bold text-xs text-[#111827]">
            // LIGHTWEIGHT PATTERN FINDINGS
          </span>
          <span className="font-mono text-xs text-[#374151] font-bold bg-[#f9fafb] px-2 py-0.5 rounded-[2px] border border-[#e5e7eb]">
            {vulnerabilities.length} MATCHES
          </span>
        </div>

        <div className="flex flex-col gap-3 font-mono">
          {vulnerabilities.map((finding, index) => (
            <button
              key={`${finding.file}-${finding.message}-${index}`}
              type="button"
              onClick={() => setSelectedFinding(finding)}
              className="w-full text-left p-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-[4px] flex flex-col gap-2.5 hover:border-[#1d4ed8] hover:bg-blue-50/30 transition-all group"
            >
              <div className="flex justify-between items-center gap-3">
                <Chip className={finding.severity === 'HIGH' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}>
                  {finding.severity} RISK
                </Chip>
                <span className="text-[11px] text-[#4b5563] bg-white px-2 py-0.5 border border-[#e5e7eb] rounded-[2px] truncate max-w-[220px]">
                  {finding.file}
                </span>
              </div>
              <p className="text-xs text-[#111827] font-bold leading-relaxed">
                {finding.message}
              </p>
              <span className="text-[10px] text-[#1d4ed8] font-bold group-hover:underline">
                Request a local AI suggestion →
              </span>
            </button>
          ))}

          {vulnerabilities.length === 0 && (
            <div className="p-4 text-center text-xs text-[#4b5563] leading-relaxed">
              No matching patterns were found by the current checks. This does not
              establish that the repository is free of vulnerabilities.
            </div>
          )}
        </div>
      </Card>

      {selectedFinding && (
        <PatchModal
          vulnerability={selectedFinding}
          onClose={() => setSelectedFinding(null)}
        />
      )}
    </>
  );
}
