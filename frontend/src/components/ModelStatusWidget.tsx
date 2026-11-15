// src/components/ModelStatusWidget.tsx
import { useEffect, useState } from 'react';
import { checkDaemonHealth } from '../services/api';
import { Card } from './Card';
import { Chip } from './Chip';

type DaemonHealth = {
  status: 'CHECKING' | 'ONLINE' | 'OFFLINE';
  active_models: string[];
  message?: string;
};

export function ModelStatusWidget() {
  const [health, setHealth] = useState<DaemonHealth>({
    status: 'CHECKING',
    active_models: [],
  });

  useEffect(() => {
    let isMounted = true;

    const refreshHealth = async () => {
      const result = await checkDaemonHealth();
      if (isMounted) setHealth(result);
    };

    void refreshHealth();
    const intervalId = window.setInterval(() => {
      void refreshHealth();
    }, 15000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const statusClass =
    health.status === 'ONLINE'
      ? 'bg-emerald-600 text-white'
      : health.status === 'OFFLINE'
        ? 'bg-rose-600 text-white'
        : 'bg-slate-500 text-white';

  const modelLabel =
    health.active_models.length > 0
      ? health.active_models.join(', ')
      : health.status === 'ONLINE'
        ? 'No models reported by Ollama'
        : 'Unavailable';

  return (
    <Card className="flex flex-col gap-4 bg-white border-[#e5e7eb] shadow-sm">
      <div className="flex justify-between items-center border-b border-[#e5e7eb] pb-3 gap-3">
        <span className="font-mono font-bold text-xs text-[#111827]">
          // LOCAL OLLAMA STATUS
        </span>
        <Chip className={statusClass}>{health.status}</Chip>
      </div>

      <div className="flex flex-col gap-2 font-mono">
        <span className="text-[10px] font-bold text-[#6b7280]">
          MODELS REPORTED BY OLLAMA
        </span>
        <p className="text-xs font-bold text-[#111827] break-words">{modelLabel}</p>
        {health.message && (
          <p className="text-[11px] text-[#6b7280] leading-relaxed">{health.message}</p>
        )}
        <p className="text-[10px] text-[#6b7280]">
          Status is checked from the backend health endpoint. No synthetic latency or token metrics are shown.
        </p>
      </div>
    </Card>
  );
}
