const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof payload?.detail === 'string'
        ? payload.detail
        : typeof payload?.error === 'string'
          ? payload.error
          : `Request failed with status ${response.status}`;
    throw new Error(message);
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

export async function scanRepo(repoPath: string) {
  return requestJson(`${API_BASE}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_path: repoPath }),
  });
}

export async function generatePatch(filePath: string, vulnerability: string) {
  return requestJson(`${API_BASE}/patch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_path: filePath, vulnerability }),
  });
}

export async function getScanHistory() {
  try {
    return await requestJson<Array<{
      repo_name: string;
      parsed_files: number;
      status: string;
      timestamp: string;
    }>>(`${API_BASE}/history`);
  } catch {
    return [];
  }
}

export async function exportScanReport(repoPath: string) {
  const response = await fetch(`${API_BASE}/export-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_path: repoPath }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.detail || payload?.error || 'Unable to export report.');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'repolens-report.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}
