// src/components/CodeViewer.tsx
import { Card } from './Card';

interface CodeViewerProps {
  content: string;
  title?: string;
}

export function CodeViewer({ content, title = "OUTPUT STREAM" }: CodeViewerProps) {
  return (
    <Card className="bg-[#0b1d30] text-[#f5f5f5] border-[#1c5fd4]">
      <div className="flex justify-between items-center mb-4 border-b border-[#1c5fd4] pb-2 font-mono text-xs text-[#f8b92a]">
        <span>// {title}</span>
        <span>STATUS: SECURE</span>
      </div>
      <pre className="font-mono text-sm overflow-x-auto text-[#f5f5f5] leading-[22px] whitespace-pre-wrap">
        {content}
      </pre>
    </Card>
  );
}