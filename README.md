# RepoLens — Evidence-Backed Repository Explorer

RepoLens is an experimental repository-analysis prototype with a FastAPI backend and a React + TypeScript + Vite frontend. It scans a supplied directory or a public GitHub repository, applies a small set of bounded source-pattern checks, records scan history in SQLite, and can request optional patch suggestions from a local Ollama model.

> **Scope:** RepoLens is not a complete security scanner, AST analyzer, dependency auditor, or vulnerability database. Its findings are heuristic matches that require manual review. A scan with zero matches does not prove that a repository is secure.

## What currently works

- Scan a directory that is accessible to the backend process, or a public HTTPS GitHub repository URL.
- Inspect supported source/configuration files while skipping common generated/dependency folders and symbolic links.
- Detect a limited set of patterns, currently unsafe `eval(` usage and credential-like assignments.
- Include repository-relative file paths with each finding.
- View the latest scan-history records stored in SQLite.
- Check whether the local Ollama service is reachable and list models it reports.
- Request a model-generated patch suggestion. The model receives the finding description and file path, not the source file. Suggestions are not applied or written to the repository.
- Export the actual scan result shown in the dashboard as JSON.

## Repository layout

- `backend/main.py` — FastAPI endpoints and bounded scanner
- `backend/requirements.txt` — Python runtime and API-test dependencies
- `backend/tests/test_main.py` — backend regression tests
- `backend/repolens.db` — created at runtime and ignored by Git; stores local scan-history metadata (repository name, file count, status, and timestamp)
- `frontend/` — React + TypeScript application
- `frontend/src/services/api.ts` — frontend API client and JSON report export
- `SKILL.md` — evidence-backed repository inspection workflow for compatible agent-skill runners

## Prerequisites

- Python 3.10+
- Node.js 22.12+ (or a Vite 8-compatible Node.js release)
- npm
- [Ollama](https://ollama.com) for optional local patch suggestions

## Start the backend

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the environment:

```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
```

```bash
# macOS / Linux
source .venv/bin/activate
```

Install dependencies:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

The default model is `gemma3:4b`. Pull it and start Ollama if it is not already running as a background service:

```bash
ollama pull gemma3:4b
ollama serve
```

In another terminal, start the API from the `backend/` directory:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend listens on loopback by default. Keep it running while using the frontend.

### Backend environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama service base URL |
| `OLLAMA_MODEL` | `gemma3:4b` | Model requested for patch suggestions |
| `REPOLENS_CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated browser origins allowed by CORS |
| `REPOLENS_DB_PATH` | `backend/repolens.db` | SQLite database path |

CORS is not authentication or authorization. The frontend's demo access screen is client-side navigation only; it does not create accounts or protect API endpoints.

## Start the frontend

In a second terminal, from the repository root:

```bash
cd frontend
npm ci
npm run dev
```

The frontend defaults to `http://127.0.0.1:8000/api` for the backend. To use a different API base URL, set `VITE_API_BASE_URL` before starting or building the frontend.

Useful scripts:

```bash
npm run lint
npm run build
npm run preview
```

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Report Ollama connectivity and model names |
| `POST` | `/api/scan` | Scan a local directory or public GitHub repository |
| `GET` | `/api/history` | Return the latest ten scan-history records |
| `POST` | `/api/patch` | Request a suggestion-only response from Ollama |

For `/api/scan`, the `repo_path` value is interpreted by the backend machine. A path on the browser user's computer is not automatically accessible to a separately hosted backend. Remote scans currently accept public HTTPS GitHub repository URLs only.

## Tests

Run backend regression tests from the repository root:

```bash
python -m unittest discover -s backend/tests -v
```

The GitHub Actions workflow runs these tests on pushes and pull requests to `main`.

## Security and prototype limitations

- The API has no server-side authentication. The frontend demo gate is not a security boundary. Keep the backend on loopback or behind a properly authenticated, access-controlled service.
- Local paths are read by the backend process. Only scan directories you own or are authorized to inspect.
- Remote cloning is restricted to public HTTPS GitHub repository URLs. Private repositories and other Git hosts are not supported.
- Remote clone execution is limited to 120 seconds. This bounds the Git subprocess lifetime but does not replace deployment-level CPU, memory, disk, or network quotas.
- The scanner uses regular-expression pattern checks, not AST parsing, SAST, CVE matching, dependency analysis, or secret-provider validation. False positives and false negatives are expected.
- Each scan is capped at 5,000 supported files and 100 MiB of eligible source content. Individual files larger than 1 MB are counted as encountered but skipped by content checks, so the displayed file count does not prove that every byte was analyzed.
- Ollama patch output is untrusted model text. RepoLens does not apply it, compile it, or test it. Review and test suggestions manually.
- SQLite scan history stores repository names, supported-file counts, statuses, and timestamps locally; the database and its sidecar files are ignored by Git. Set `REPOLENS_DB_PATH` to a private writable location when needed, and do not expose scan history from a shared or unauthenticated service.

## Agent skill

See [SKILL.md](SKILL.md) for a reusable, evidence-backed workflow for explaining a Git repository without inventing architecture, test results, security findings, or dependency relationships.

## License

The repository is licensed under the MIT License; see [LICENSE](LICENSE). The Ollama runtime and any model weights you download are governed by their own terms and are not relicensed by this repository.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). When reporting a scanner issue, include a minimal non-sensitive fixture and the expected versus actual result. Never include live credentials or private source code in an issue.
