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
  vulnerabilities: {
    severity: 'HIGH' | 'MEDIUM';
    message: string;
    file: string;
  }[];
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
  // Workspaces are populated only by successful API responses in this browser session.
  const [activeRepos, setActiveRepos] = useState<ScanReport[]>([]);
  const [currentReport, setCurrentReport] = useState<ScanReport | null>(null);

  const addReport = (report: ScanReport) => {
    setActiveRepos((prev) => [report, ...prev]);
    setCurrentReport(report);
  };

  const selectReport = (id: string) => {
    const found = activeRepos.find((report) => report.id === id);
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
