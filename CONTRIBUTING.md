# Contributing to RepoLens

Thanks for helping improve RepoLens.

## Development setup

Follow the backend and frontend setup instructions in [README.md](README.md). Keep changes scoped to the backend, frontend, or shared API contract.

## Engineering expectations

- Validate paths and user input; avoid unsafe filesystem traversal.
- Do not scan secrets or directories the operator is not authorized to inspect.
- Add tests for scanner exclusions, path handling, malformed requests, Ollama timeouts/failures, and API responses.
- Treat all model-generated findings and patches as untrusted suggestions.
- Avoid hard-coded credentials, permissive production CORS, and fabricated security findings.
- Keep SQLite test data and local runtime artifacts out of commits unless fixtures are intentionally sanitized.

## Frontend changes

Run `npm run build` and `npm run lint` from `frontend/`. Document API changes and verify frontend/backend compatibility.

## Backend changes

Install dependencies from `backend/requirements.txt`. Add reproducible tests and document any new environment variables or model requirements.

## Pull requests

Include the problem, implementation summary, test commands/results, security implications, and known limitations. Never claim the tool is a complete security audit.
