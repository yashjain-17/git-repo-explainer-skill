// src/components/FileTree.tsx
import { Card } from './Card';

export function FileTree() {
  const files = [
    { name: 'src/', type: 'folder', status: 'scanned' },
    { name: '├── components/', type: 'folder', status: 'scanned' },
    { name: '│   ├── Button.tsx', type: 'file', status: 'active' },
    { name: '│   ├── Card.tsx', type: 'file', status: 'active' },
    { name: '│   └── ReportTabs.tsx', type: 'file', status: 'active' },
    { name: '├── pages/', type: 'folder', status: 'scanned' },
    { name: '│   ├── Home.tsx', type: 'file', status: 'active' },
    { name: '│   └── Dashboard.tsx', type: 'file', status: 'active' },
    { name: '└── App.tsx', type: 'file', status: 'active' },
  ];

  return (
    <Card className="w-full bg-[#fafafa] border-[#f1f2f3]">
      <div className="flex justify-between items-center mb-4 border-b border-[#f1f2f3] pb-2 font-mono text-xs font-bold text-[#0b1d30]">
        <span>// REPOSITORY FILE STRUCTURE</span>
        <span className="text-[#6b6f76]">PRUNED & SAFE</span>
      </div>
      <div className="font-mono text-xs leading-[22px] text-[#242425]">
        {files.map((file, idx) => (
          <div key={idx} className="flex justify-between items-center py-1 hover:bg-[#f5f5f5] px-2 rounded-[2px]">
            <span className={file.type === 'folder' ? 'font-bold text-[#0b1d30]' : 'text-[#6b6f76]'}>
              {file.name}
            </span>
            <span className="text-[10px] bg-[#f8b92a] text-[#0b1d30] px-2 py-0.5 rounded-[2px] font-bold">
              {file.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}