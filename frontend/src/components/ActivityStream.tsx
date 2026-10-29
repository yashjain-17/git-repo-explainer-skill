// src/components/ActivityStream.tsx
import { useState, useEffect } from 'react';
import { Card } from './Card';

interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: 'INFO' | 'SCAN' | 'WARN';
}

export function ActivityStream() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, timestamp: '12:00:01', message: 'Ingest initiated: ./repolens-core', type: 'INFO' },
    { id: 2, timestamp: '12:00:03', message: 'Bounded scan active on /api_gateway/', type: 'SCAN' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs: string[] = [
        'Scanning: auth_service/models.py...',
        'Parsing AST: cli_tool.py',
        'Pruning node_modules/ (found 12k files)...',
        'Found sensitive token pattern in config.yaml',
        'Indexing dependencies...',
        'Analyzing modular boundaries...',
        'Analyzing crypto/encryption.js...',
        'Processing ui_components/Button.tsx'
      ];
      const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)];
      const newEntry: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: randomLog,
        type: randomLog.includes('Found') ? 'WARN' : 'SCAN'
      };
      setLogs((prev) => [newEntry, ...prev.slice(0, 7)]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="flex flex-col gap-4 bg-white border-[#e5e7eb] shadow-sm h-[280px]">
      <div className="flex justify-between items-center border-b border-[#e5e7eb] pb-3">
        <span className="font-mono font-bold text-xs text-[#111827]">// LIVE AST SCANNING ACTIVITY</span>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="flex flex-col-reverse gap-2 font-mono text-[11px] text-[#374151] h-full overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 items-start">
            <span className="text-[#6b7280] tabular-nums">{log.timestamp}</span>
            <span className={`flex-1 ${log.type === 'WARN' ? 'text-rose-600 font-bold' : ''}`}>
              {log.message}
            </span>
            {log.type === 'SCAN' && <span className="text-[#1d4ed8] text-[10px]">▲</span>}
          </div>
        ))}
        
        <div className="h-6" />
      </div>
    </Card>
  );
}