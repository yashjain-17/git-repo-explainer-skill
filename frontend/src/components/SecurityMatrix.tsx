// src/components/SecurityMatrix.tsx
import { useState } from 'react';
import { Card } from './Card';
import { Chip } from './Chip';
import { PatchModal } from './PatchModal';

interface Vulnerability {
  severity: 'HIGH' | 'MED' | 'LOW';
  message: string;
  file: string;
}

interface SecurityMatrixProps {
  vulnerabilities: Vulnerability[];
}

export function SecurityMatrix({ vulnerabilities }: SecurityMatrixProps) {
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);

  return (
    <>
      <Card className="flex flex-col gap-4 bg-white border-[#e5e7eb] shadow-sm">
        <div className="flex justify-between items-center border-b border-[#e5e7eb] pb-3">
          <span className="font-mono font-bold text-xs text-[#111827]">// SECURITY AUDIT & VULNERABILITY MATRIX</span>
          <span className="font-mono text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-[2px] border border-rose-200">
            {vulnerabilities.length} ISSUES FOUND
          </span>
        </div>

        <div className="flex flex-col gap-3 font-mono">
          {vulnerabilities.map((vuln, index) => (
            <div 
              key={index}
              onClick={() => setSelectedVuln(vuln)}
              className="p-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-[4px] flex flex-col gap-2.5 cursor-pointer hover:border-[#1d4ed8] hover:bg-blue-50/30 transition-all group"
            >
              <div className="flex justify-between items-center">
                <Chip className={vuln.severity === 'HIGH' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}>
                  {vuln.severity} RISK
                </Chip>
                <span className="text-[11px] text-[#4b5563] bg-white px-2 py-0.5 border border-[#e5e7eb] rounded-[2px] truncate max-w-[180px]">{vuln.file}</span>
              </div>
              <p className="text-xs text-[#111827] font-bold leading-relaxed">{vuln.message}</p>
              <div className="flex justify-between items-center pt-1 border-t border-[#e5e7eb]/60">
                <span className="text-[10px] text-[#1d4ed8] font-bold group-hover:underline">Click to generate AI patch →</span>
                <span className="text-[10px] text-[#9ca3af]">ID: CVE-2026-0{index+4}</span>
              </div>
            </div>
          ))}

          {vulnerabilities.length === 0 && (
            <div className="p-4 text-center text-xs text-[#4b5563]">
              No security vulnerabilities detected in target scope.
            </div>
          )}
        </div>
      </Card>

      {/* Patch Assistant Modal */}
      {selectedVuln && (
        <PatchModal 
          vulnerability={selectedVuln} 
          onClose={() => setSelectedVuln(null)} 
        />
      )}
    </>
  );
}