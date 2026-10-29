// src/services/api.ts
const API_BASE = 'http://127.0.0.1:8000/api';

export async function checkDaemonHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    return { status: 'OFFLINE', latency_ms: 0 };
  }
}

export async function scanRepo(repoPath: string) {
  const res = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_path: repoPath })
  });
  return await res.json();
}

export async function generatePatch(filePath: string, vulnerability: string) {
  const res = await fetch(`${API_BASE}/patch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_path: filePath, vulnerability })
  });
  return await res.json();
}

// Fetch past scan history from SQLite database
export async function getScanHistory() {
  try {
    const res = await fetch(`${API_BASE}/history`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

// Export scan report as a downloadable file
export async function exportScanReport(repoPath: string) {
  try {
    const res = await fetch(`${API_BASE}/export-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_path: repoPath })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repolens-report.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error("Failed to export report", err);
  }
}