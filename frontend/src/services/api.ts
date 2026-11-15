const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

export type FindingSeverity = 'HIGH' | 'MEDIUM';

export type VulnerabilityFinding = {
  severity: FindingSeverity;
  message: string;
  file: string;
};

export type ScanResponse = {
  repo_name: string;
  parsed_files: number;
  status: 'SCANNED';
  breakdown: string;
  pruningLog: string;
  roadmap: string;
  vulnerabilities: VulnerabilityFinding[];
};

export type ScanHistoryEntry = {
  repo_name: string;
  parsed_files: number;
  status: string;
  timestamp: string;
};

export type ScanReportExport = {
  repoName: string;
  timestamp: string;
  parsedFiles: number;
  breakdown: string;
  pruningLog: string;
  roadmap: string;
  vulnerabilities: VulnerabilityFinding[];
};

export type PatchResponse = {
  patch_diff: string;
  status: 'SUGGESTION_ONLY';
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const contentType = response.headers.get('content-type') || '';
  const payload: unknown = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    const details =
      payload && typeof payload === 'object'
        ? (payload as { detail?: unknown; error?: unknown }).detail ??
          (payload as { error?: unknown }).error
        : payload;
    const message =
      typeof details === 'string' && details.trim()
        ? details
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (payload === null) {
    throw new Error('The backend returned an empty or invalid JSON response.');
  }

  return payload as T;
}

export async function checkDaemonHealth() {
  try {
    return await requestJson<{
      status: 'ONLINE' | 'OFFLINE';
      active_models: string[];
      message?: string;
    }>(`${API_BASE}/health`);
  } catch {
    return {
      status: 'OFFLINE' as const,
      active_models: [],
      message: 'Unable to reach the RepoLens backend.',
    };
  }
}

export async function scanRepo(repoPath: string): Promise<ScanResponse> {
  return requestJson<ScanResponse>(`${API_BASE}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_path: repoPath }),
  });
}

export async function generatePatch(
  filePath: string,
  vulnerability: string,
): Promise<PatchResponse> {
  return requestJson<PatchResponse>(`${API_BASE}/patch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_path: filePath, vulnerability }),
  });
}

export async function getScanHistory(): Promise<ScanHistoryEntry[]> {
  const history = await requestJson<ScanHistoryEntry[]>(`${API_BASE}/history`);
  if (!Array.isArray(history)) {
    throw new Error('The backend returned an invalid scan-history response.');
  }
  return history;
}

export function exportScanReport(report: ScanReportExport): void {
  const safeName =
    report.repoName.split(/[\\/]/).pop()?.replace(/[^a-z0-9._-]/gi, '_') || 'scan';
  const payload = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    engine: 'RepoLens lightweight pattern scanner',
    warning:
      'Heuristic pattern findings only. This export is not a complete security audit and does not prove that the repository is secure.',
    report,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `repolens-${safeName}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
