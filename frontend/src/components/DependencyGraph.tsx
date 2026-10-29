// src/components/DependencyGraph.tsx
import { Card } from './Card';

export function DependencyGraph() {
  const dependencies = [
    { name: 'react', version: '^19.0.0', status: 'UP-TO-DATE', ecosystem: 'npm' },
    { name: 'react-router-dom', version: '^7.0.0', status: 'UP-TO-DATE', ecosystem: 'npm' },
    { name: 'tailwindcss', version: '^4.0.0', status: 'UP-TO-DATE', ecosystem: 'css' },
    { name: 'fastapi', version: '0.110.0', status: 'PATCH REQUIRED', ecosystem: 'python' },
    { name: 'uvicorn', version: '0.28.0', status: 'STABLE', ecosystem: 'python' },
    { name: 'ollama-python', version: '0.1.4', status: 'UP-TO-DATE', ecosystem: 'python' }
  ];

  return (
    <Card className="w-full bg-[#fafafa] border-[#f1f2f3]">
      <div className="flex justify-between items-center mb-4 border-b border-[#f1f2f3] pb-2 font-mono text-xs font-bold text-[#0b1d30]">
        <span>// DEPENDENCY ECOSYSTEM MAPPING</span>
        <span className="text-[#1c5fd4]">6 PACKAGES PARSED</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
        {dependencies.map((dep, idx) => (
          <div key={idx} className="p-3 bg-[#f5f5f5] border border-[#f1f2f3] rounded-[2px] flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#0b1d30]">{dep.name}</span>
              <span className="text-[10px] bg-[#0b1d30] text-[#f8b92a] px-2 py-0.5 rounded-[2px]">
                {dep.ecosystem}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#6b6f76] text-[11px]">
              <span>Ver: {dep.version}</span>
              <span className={`text-[10px] font-bold ${dep.status === 'PATCH REQUIRED' ? 'text-[#d92d20]' : 'text-[#242425]'}`}>
                {dep.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}