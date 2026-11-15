// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Chip } from '../components/Chip';
import { ReportTabs } from '../components/ReportTabs';
import { SecurityMatrix } from '../components/SecurityMatrix';
import { ExportToolbar } from '../components/ExportToolbar';
import { ModelStatusWidget } from '../components/ModelStatusWidget';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import {
  scanRepo,
  getScanHistory,
  exportScanReport,
  type ScanHistoryEntry,
} from '../services/api';

const ScanSummary = ({
  fileCount,
  findingCount,
}: {
  fileCount: number;
  findingCount: number;
}) => (
  <Card className="w-full bg-[#0b1d30] border-[#0b1d30] text-white flex flex-col gap-5">
    <div className="flex justify-between items-center">
      <span className="font-mono font-bold text-sm text-[#f8b92a]">
        // COMPLETED SCAN SUMMARY
      </span>
      <Chip className="bg-[#f8b92a] text-[#0b1d30]">SCANNED</Chip>
    </div>
    <div className="grid grid-cols-2 gap-4 font-mono">
      <div className="bg-white/10 p-4 rounded-[2px] flex flex-col gap-1">
        <span className="text-[10px] font-bold text-[#cbd5e1]">SUPPORTED FILES</span>
        <span className="text-3xl font-bold text-white">{fileCount}</span>
      </div>
      <div className="bg-white/10 p-4 rounded-[2px] flex flex-col gap-1">
        <span className="text-[10px] font-bold text-[#cbd5e1]">PATTERN FINDINGS</span>
        <span className="text-3xl font-bold text-[#f8b92a]">{findingCount}</span>
      </div>
    </div>
    <p className="text-[11px] leading-relaxed text-[#cbd5e1]">
      Counts reflect the current lightweight source-pattern scan, not a complete
      security audit or dependency analysis.
    </p>
  </Card>
);

const IdleWorkspaceGraphic = () => (
  <div className="w-full flex flex-col items-center justify-center gap-6 text-center p-12 border-2 border-dashed border-[#e5e7eb] rounded-[4px] bg-white shadow-sm">
    <div className="w-20 h-20 flex items-center justify-center text-[50px] font-black text-[#111827]/10 bg-[#f9fafb] rounded-full border border-[#e5e7eb]">Ξ</div>
    <div className="flex flex-col gap-2 max-w-md">
      <p className="font-mono text-[20px] text-[#111827] font-bold">Ready to Scan Repository</p>
      <p className="font-mono text-[14px] text-[#4b5563] leading-[22px]">
        Select a local repository folder or public GitHub repository to run RepoLens' lightweight source-pattern checks.
      </p>
    </div>
  </div>
);

export function Dashboard() {
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();
  const { activeRepos, currentReport, addReport, selectReport } = useWorkspace();
  const [repoPath, setRepoPath] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [sqliteHistory, setSqliteHistory] = useState<ScanHistoryEntry[]>([]);

  // Sync SQLite scan history from FastAPI backend on load
  useEffect(() => {
    getScanHistory().then((data) => {
      if (Array.isArray(data)) setSqliteHistory(data);
    });
  }, []);

  const handleScan = async () => {
    const target = repoPath.trim();
    if (!target || isScanning) return;

    setIsScanning(true);
    try {
      const data = await scanRepo(target);
      const newRepo = {
        id: `repo-${Date.now()}`,
        repoName: data.repo_name || target,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        parsedFiles: data.parsed_files,
        breakdown: data.breakdown,
        pruningLog: data.pruningLog,
        roadmap: data.roadmap,
        vulnerabilities: data.vulnerabilities ?? [],
      };

      addReport(newRepo);
      setRepoPath('');
      setSqliteHistory(await getScanHistory());
    } catch (err) {
      console.error('Backend scan failed:', err);
      window.alert(err instanceof Error ? err.message : 'Repository scan failed. Check the backend logs.');
    } finally {
      setIsScanning(false);
    }
  };

  const filteredRepos = activeRepos.filter(r => r.repoName.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111827] flex flex-col selection:bg-[#f8b92a] selection:text-[#0b1d30]">
      {/* Header */}
      <header className="w-full px-8 py-6 bg-white border-b border-[#e5e7eb] flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            className="h-[36px] px-3 text-xs" 
            onClick={() => navigate('/')}
          >
            ← Back Home
          </Button>
          <div className="font-mono font-bold text-lg cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
            <span className="text-[#0b1d30] bg-[#f8b92a] px-3 py-1 rounded-[2px]">MLH</span>
            <span className="text-[#4b5563] text-sm">// ENTERPRISE COMMAND CENTER</span>
          </div>
        </div>

        <div className="flex gap-4 items-center font-mono">
          <button
            onClick={() => currentReport && exportScanReport(currentReport)}
            disabled={!currentReport}
            className="bg-[#111827] text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
          >
            ↓ Export JSON Report
          </button>
          <Chip>WORKSPACES: {activeRepos.length} ACTIVE</Chip>
          <span className="text-xs text-[#4b5563] bg-[#f9fafb] border border-[#e5e7eb] px-3 py-1.5 rounded-[2px] font-bold">
            {userEmail}
          </span>
          <Button variant="secondary" className="h-[36px] px-3 text-xs" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Workspace Grid (2 Columns) */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-8 items-start">
        
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-4 bg-white border-[#e5e7eb] shadow-sm">
            <h2 className="font-mono font-bold text-[18px] text-[#111827]">Ingest Repository</h2>
            <Input 
              label="Target Path / Git URL"
              value={repoPath}
              onChange={(e) => setRepoPath(e.target.value)}
              placeholder="e.g., ./my-service"
            />
            
            <Button 
              variant="primary" 
              onClick={handleScan}
              disabled={isScanning}
              className="w-full h-[48px] text-[14px] mt-2 cursor-pointer font-bold"
            >
              {isScanning ? 'Scanning repository...' : 'Initialize Scan →'}
            </Button>
          </Card>

          {/* Real Ollama Model Status Widget */}
          <ModelStatusWidget />
          
          {/* SQLite Backend Scan History Card */}
          <Card className="flex flex-col gap-4 bg-white border-[#e5e7eb] shadow-sm">
            <div className="flex flex-col gap-2">
              <h3 className="font-mono font-bold text-[14px] text-[#111827]">SQLite Scan History</h3>
              <input 
                type="text"
                placeholder="Filter database logs..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-[#f9fafb] text-[#111827] border border-[#e5e7eb] text-xs font-mono p-2 rounded-[2px] outline-none focus:border-[#f8b92a]"
              />
            </div>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {sqliteHistory.length === 0 ? (
                <span className="text-xs text-gray-400 italic">No backend scan records found.</span>
              ) : (
                sqliteHistory
                  .filter((item) => item.repo_name?.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3 border rounded-[2px] cursor-pointer font-mono text-xs transition-colors flex flex-col gap-1 bg-[#f9fafb] text-[#111827] border-[#e5e7eb] hover:border-[#9ca3af]"
                    >
                      <span className="font-bold truncate">{item.repo_name}</span>
                      <span className="text-[10px] text-[#4b5563]">
                        {item.timestamp?.split('.')[0]} // <strong className="text-emerald-600">{item.parsed_files} files</strong>
                      </span>
                    </div>
                  ))
              )}
            </div>
          </Card>

          {/* Active Workspace Sessions List */}
          <Card className="flex flex-col gap-4 bg-white border-[#e5e7eb] shadow-sm">
            <div className="flex flex-col gap-2">
              <h3 className="font-mono font-bold text-[14px] text-[#111827]">Active Workspaces</h3>
            </div>
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">
              {filteredRepos.map((repo) => (
                <div 
                  key={repo.id}
                  onClick={() => selectReport(repo.id)}
                  className={`p-3 border rounded-[2px] cursor-pointer font-mono text-xs transition-colors flex flex-col gap-1 ${
                    currentReport?.id === repo.id 
                      ? 'bg-[#0b1d30] text-white border-[#0b1d30]' 
                      : 'bg-[#f9fafb] text-[#111827] border-[#e5e7eb] hover:border-[#9ca3af]'
                  }`}
                >
                  <span className="font-bold truncate">{repo.repoName}</span>
                  <span className={`text-[10px] ${currentReport?.id === repo.id ? 'text-[#f8b92a]' : 'text-[#4b5563]'}`}>
                    {repo.timestamp} // {repo.parsedFiles} files
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Main Panel */}
        <div className="flex flex-col gap-8">
          {currentReport ? (
            <>
              <Card className="flex justify-between items-center bg-white border-[#e5e7eb] shadow-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs text-[#4b5563] font-bold">// ACTIVE TARGET SESSION</span>
                  <h2 className="font-mono font-bold text-[22px] text-[#111827]">{currentReport.repoName}</h2>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="font-mono text-xs bg-[#f9fafb] border border-[#e5e7eb] px-3 py-2 rounded-[2px] font-bold">
                    Files Parsed: <strong>{currentReport.parsedFiles}</strong>
                  </span>
                  <Chip>SCANNED</Chip>
                </div>
              </Card>

              {/* Security Matrix with AI Patching Support */}
              <SecurityMatrix vulnerabilities={currentReport.vulnerabilities} />

<ScanSummary
                fileCount={currentReport.parsedFiles}
                findingCount={currentReport.vulnerabilities.length}
              />

              <ReportTabs data={{
                breakdown: currentReport.breakdown,
                pruningLog: currentReport.pruningLog,
                roadmap: currentReport.roadmap
              }} />

              <ExportToolbar reportContent={`${currentReport.breakdown}\n\n${currentReport.pruningLog}\n\n${currentReport.roadmap}`} />
            </>
          ) : (
            <IdleWorkspaceGraphic />
          )}
        </div>

      </main>
    </div>
  );
}