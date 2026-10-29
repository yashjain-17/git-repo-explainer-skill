// src/context/WorkspaceContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

interface ScanReport {
  id: string;
  repoName: string;
  timestamp: string;
  parsedFiles: number;
  breakdown: string;
  pruningLog: string;
  roadmap: string;
  vulnerabilities: { severity: 'HIGH' | 'MED' | 'LOW'; message: string; file: string }[];
}

interface WorkspaceContextType {
  activeRepos: ScanReport[];
  currentReport: ScanReport | null;
  addReport: (report: ScanReport) => void;
  selectReport: (id: string) => void;
  clearHistory: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeRepos, setActiveRepos] = useState<ScanReport[]>([
    {
      id: 'repo-01',
      repoName: './repolens-core',
      timestamp: '2026-10-20 12:00',
      parsedFiles: 42,
      breakdown: `# Core Repository Analysis\n- Full AST parsing complete.\n- Zero external leakage detected.`,
      pruningLog: '- Pruned 14 .env and node_modules blocks.',
      roadmap: '- Onboarding: Review main entry point in App.tsx',
      vulnerabilities: [
        { severity: 'MED', message: 'Hardcoded config fallback detected', file: 'src/config.ts' }
      ]
    }
  ]);
  const [currentReport, setCurrentReport] = useState<ScanReport | null>(activeRepos[0]);

  const addReport = (report: ScanReport) => {
    setActiveRepos((prev) => [report, ...prev]);
    setCurrentReport(report);
  };

  const selectReport = (id: string) => {
    const found = activeRepos.find((r) => r.id === id);
    if (found) setCurrentReport(found);
  };

  const clearHistory = () => {
    setActiveRepos([]);
    setCurrentReport(null);
  };

  return (
    <WorkspaceContext.Provider value={{ activeRepos, currentReport, addReport, selectReport, clearHistory }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within a WorkspaceProvider');
  return context;
}