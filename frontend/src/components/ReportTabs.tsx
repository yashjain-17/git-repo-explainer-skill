// src/components/ReportTabs.tsx
import { useState } from 'react';
import { Card } from './Card';

interface ReportTabsProps {
  data: {
    breakdown: string;
    pruningLog: string;
    roadmap: string;
  };
}

export function ReportTabs({ data }: ReportTabsProps) {
  const [activeTab, setActiveTab] = useState<'architecture' | 'safety' | 'roadmap'>('architecture');

  const getContent = () => {
    switch (activeTab) {
      case 'architecture':
        return data.breakdown;
      case 'safety':
        return data.pruningLog;
      case 'roadmap':
        return data.roadmap;
      default:
        return '';
    }
  };

  return (
    <Card className="flex flex-col gap-6 bg-white border-[#f1f2f3]">
      {/* Tab Header Buttons */}
      <div className="flex gap-4 border-b border-[#f1f2f3] pb-4 font-mono text-xs">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3 py-1.5 rounded-[2px] font-bold cursor-pointer transition-colors ${
            activeTab === 'architecture'
              ? 'bg-[#f8b92a] text-[#0b1d30]'
              : 'bg-[#f5f5f5] text-[#6b6f76] hover:text-[#242425]'
          }`}
        >
          // ARCHITECTURE
        </button>
        <button
          onClick={() => setActiveTab('safety')}
          className={`px-3 py-1.5 rounded-[2px] font-bold cursor-pointer transition-colors ${
            activeTab === 'safety'
              ? 'bg-[#f8b92a] text-[#0b1d30]'
              : 'bg-[#f5f5f5] text-[#6b6f76] hover:text-[#242425]'
          }`}
        >
          // SAFETY & PRUNING
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-3 py-1.5 rounded-[2px] font-bold cursor-pointer transition-colors ${
            activeTab === 'roadmap'
              ? 'bg-[#f8b92a] text-[#0b1d30]'
              : 'bg-[#f5f5f5] text-[#6b6f76] hover:text-[#242425]'
          }`}
        >
          // ROADMAP
        </button>
      </div>

      {/* Tab Content Body with high-contrast text color */}
      <div className="font-mono text-sm text-[#242425] bg-[#fafafa] p-6 rounded-[2px] border border-[#f1f2f3] whitespace-pre-line leading-[24px]">
        {getContent()}
      </div>
    </Card>
  );
}