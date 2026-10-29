// src/components/ModelStatusWidget.tsx
import { useState, useEffect } from 'react';
import { Card } from './Card';
import { Chip } from './Chip';

export function ModelStatusWidget() {
  const [latency, setLatency] = useState(14);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 11);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="flex flex-col gap-4 bg-white border-[#e5e7eb] shadow-sm">
      <div className="flex justify-between items-center border-b border-[#e5e7eb] pb-3">
        <span className="font-mono font-bold text-xs text-[#111827]">// LOCAL LLM DAEMON</span>
        <Chip className="bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-[2px]">ONLINE (PORT 11434)</Chip>
      </div>

      <div className="grid grid-cols-3 gap-3 font-mono">
        <div className="bg-[#f9fafb] p-3 rounded-[2px] border border-[#e5e7eb] flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#6b7280]">MODEL</span>
          <span className="text-xs font-bold text-[#111827]">gemma2:27b</span>
        </div>
        <div className="bg-[#f9fafb] p-3 rounded-[2px] border border-[#e5e7eb] flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#6b7280]">LATENCY</span>
          <span className="text-xs font-bold text-[#1d4ed8]">{latency}ms</span>
        </div>
        <div className="bg-[#f9fafb] p-3 rounded-[2px] border border-[#e5e7eb] flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#6b7280]">CONTEXT</span>
          <span className="text-xs font-bold text-[#111827]">32k TOKENS</span>
        </div>
      </div>
    </Card>
  );
}