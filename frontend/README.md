# RepoLens frontend

This is the React + TypeScript + Vite interface for RepoLens. The complete setup, backend configuration, API behavior, security limitations, and test commands are documented in the [repository root README](../README.md).

## Run locally

From this directory:

```bash
npm ci
npm run dev
```

The frontend defaults to `http://127.0.0.1:8000/api`. Set `VITE_API_BASE_URL` at build/dev time if the FastAPI backend uses a different base URL.

## Checks

```bash
npm run lint
npm run build
```

The sign-in screen is a client-side demo gate only. It is not authentication and does not secure the backend API.
