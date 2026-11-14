# RepoLens — Repository Explorer and Local AI Assistant

RepoLens is a developer tool prototype with a FastAPI backend and a React + TypeScript + Vite frontend. The backend scans a supplied local path or Git URL, stores scan history in SQLite, checks selected source patterns, and communicates with a local Ollama service.

> RepoLens is an experimental code-understanding aid, not a complete security scanner. Review all findings and generated patches manually.

## Repository layout

- `backend/main.py` — FastAPI API and repository scanning logic
- `backend/requirements.txt` — Python dependencies
- `backend/repolens.db` — SQLite database file currently tracked in the repository
- `frontend/` — React + TypeScript application
- `frontend/src/services/api.ts` — frontend API client

## Prerequisites

- Python 3.10+
- Node.js compatible with the Vite version in `frontend/package.json`
- npm
- [Ollama](https://ollama.com) running locally
- Enough memory for the configured model; the backend request model defaults to `gemma2:27b`

## Start the backend

Open a terminal at the repository root:

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

Install and run:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
ollama pull gemma2:27b
ollama serve
```

If Ollama is already running as a background service, do not start a second daemon. In another terminal, still inside `backend/`:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Start the frontend

In a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

The frontend API client currently targets `http://127.0.0.1:8000/api`. Keep the backend running while using the UI.

Useful frontend scripts:

```bash
npm run build
npm run lint
npm run preview
```

## Important limitations and safety

- The backend currently enables permissive CORS. Do not expose it to an untrusted network without proper origin restrictions and authentication.
- Repository paths and Git URLs are accepted by the scan API. Only scan repositories you own or are authorized to inspect; do not point it at sensitive directories.
- The current pattern checks are heuristic and can produce false positives and false negatives. They are not a substitute for SAST, dependency scanning, secret scanning, or a professional security review.
- The backend's model default is `gemma2:27b`; adjust it to a model that is actually installed and supported by your hardware.
- The SQLite database file is tracked in the repository. Review whether it contains test or user data before publishing or sharing.
- Generated patches must be reviewed, tested, and approved by a developer before use.

## Development checks

Run `npm run build` and `npm run lint` in `frontend/`. Add backend tests for API validation, path handling, scanner exclusions, model failures, and database behavior before treating the project as production-ready.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
