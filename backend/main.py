import logging
import os
import re
import shutil
import sqlite3
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import git
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

app = FastAPI(title="RepoLens Repository Explainer", version="2.8.0")
logger = logging.getLogger(__name__)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "REPOLENS_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:4b")
DB_PATH = Path(os.getenv("REPOLENS_DB_PATH", Path(__file__).with_name("repolens.db"))).expanduser()
MAX_FILES = 5000
MAX_SOURCE_BYTES = 1_000_000
MAX_TOTAL_SOURCE_BYTES = 100 * 1024 * 1024
SOURCE_EXTENSIONS = {".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".go", ".rs", ".php", ".rb"}
CREDENTIAL_PATTERN = re.compile(
    r"""\b(?:api[_-]?key|secret|token)\b\s*[:=]\s*(?:['"])?([A-Za-z0-9_./+=-]{16,})(?:['"])?""",
    re.IGNORECASE,
)
SKIP_DIRS = {".git", "node_modules", "build", "dist", "__pycache__", ".venv", "venv", ".next"}


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS scan_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                repo_name TEXT NOT NULL,
                parsed_files INTEGER NOT NULL,
                status TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
            """
        )



class ScanRequest(BaseModel):
    repo_path: str = Field(min_length=1, max_length=2048)

    @field_validator("repo_path")
    @classmethod
    def normalize_repo_path(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Repository path must not be blank.")
        return normalized


class VulnerabilityPatchRequest(BaseModel):
    file_path: str = Field(min_length=1, max_length=1024)
    vulnerability: str = Field(min_length=1, max_length=4000)


def _resolve_scan_target(target: str, temp_dir: str) -> tuple[Path, str]:
    """Accept a local directory or a public HTTPS GitHub repository URL only."""
    if target.startswith(("https://", "http://", "git@", "ssh://")):
        try:
            parsed = urlparse(target)
            port = parsed.port
        except ValueError as exc:
            raise HTTPException(
                status_code=400,
                detail="Remote scans must use a public https://github.com/owner/repository URL.",
            ) from exc

        if (
            parsed.scheme != "https"
            or parsed.hostname != "github.com"
            or parsed.username
            or parsed.password
            or port not in (None, 443)
            or not re.fullmatch(r"/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(?:\.git)?/?", parsed.path)
            or parsed.query
            or parsed.fragment
        ):
            raise HTTPException(
                status_code=400,
                detail="Remote scans must use a public https://github.com/owner/repository URL.",
            )
        clean_url = f"https://github.com{parsed.path.rstrip('/')}"
        try:
            git.Repo.clone_from(
                clean_url,
                temp_dir,
                depth=1,
                multi_options=["--filter=blob:none"],
                kill_after_timeout=120,
                env={**os.environ, "GIT_TERMINAL_PROMPT": "0"},
            )
        except Exception as exc:
            logger.warning("Unable to clone public GitHub repository %s", clean_url, exc_info=True)
            raise HTTPException(
                status_code=400,
                detail=(
                    "Unable to clone the public GitHub repository. "
                    "Confirm that it exists and is publicly accessible."
                ),
            ) from exc
        return Path(temp_dir).resolve(), clean_url

    local_path = Path(target).expanduser().resolve()
    if not local_path.exists() or not local_path.is_dir():
        raise HTTPException(status_code=400, detail="Local repository path must exist and be a directory.")
    return local_path, str(local_path)


def _is_supported_source_file(file_path: Path) -> bool:
    """Include common dotenv filenames as well as supported source extensions."""
    name = file_path.name.lower()
    return (
        file_path.suffix.lower() in SOURCE_EXTENSIONS
        or name == ".env"
        or name.startswith(".env.")
    )


def check_code_security(file_path: Path):
    """Run bounded, lightweight pattern checks; this is not a full security audit."""
    try:
        if file_path.stat().st_size > MAX_SOURCE_BYTES:
            return []
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return []

    issues = []
    if re.search(r"\beval\s*\(", content):
        issues.append("Critical: Use of unsafe eval() function detected.")
    if CREDENTIAL_PATTERN.search(content):
        issues.append("High: Potential hardcoded credential-like value detected.")
    return issues


@app.get("/api/health")
def health_check():
    """Report actual Ollama connectivity without inventing latency or model state."""
    try:
        response = requests.get(f"{OLLAMA_HOST}/api/tags", timeout=3)
        response.raise_for_status()
        payload = response.json()
        if not isinstance(payload, dict):
            raise ValueError("Unexpected Ollama response.")
        models = payload.get("models", [])
        if not isinstance(models, list):
            models = []
        return {
            "status": "ONLINE",
            "active_models": [
                model.get("name")
                for model in models
                if isinstance(model, dict) and model.get("name")
            ],
        }
    except (requests.RequestException, ValueError):
        return {
            "status": "OFFLINE",
            "active_models": [],
            "message": "Ollama is unavailable. Start the local Ollama service to enable AI features.",
        }


@app.post("/api/scan")
def scan_repository(payload: ScanRequest):
    """Scan a local directory or public GitHub repository using bounded rule checks."""
    init_db()
    temp_dir = tempfile.mkdtemp(prefix="repolens-")
    target_path = None
    vulnerabilities = []
    parsed_files = 0
    analyzed_source_bytes = 0
    try:
        target_path, display_name = _resolve_scan_target(payload.repo_path.strip(), temp_dir)

        for root, dirs, files in os.walk(target_path, followlinks=False):
            dirs[:] = [
                name for name in dirs
                if name not in SKIP_DIRS and not (Path(root) / name).is_symlink()
            ]
            for filename in files:
                source_path = Path(root) / filename
                if source_path.is_symlink() or not _is_supported_source_file(source_path):
                    continue
                parsed_files += 1
                if parsed_files > MAX_FILES:
                    raise HTTPException(
                        status_code=413,
                        detail=f"Repository exceeds the {MAX_FILES}-source-file scan limit.",
                    )

                try:
                    source_size = source_path.stat().st_size
                except OSError:
                    continue

                if source_size <= MAX_SOURCE_BYTES:
                    analyzed_source_bytes += source_size
                    if analyzed_source_bytes > MAX_TOTAL_SOURCE_BYTES:
                        limit_mib = MAX_TOTAL_SOURCE_BYTES // (1024 * 1024)
                        raise HTTPException(
                            status_code=413,
                            detail=f"Repository exceeds the {limit_mib} MiB analyzed-source limit.",
                        )

                for issue in check_code_security(source_path):
                    vulnerabilities.append({
                        "severity": "HIGH" if issue.startswith(("Critical", "High")) else "MEDIUM",
                        "message": issue,
                        "file": source_path.relative_to(target_path).as_posix(),
                    })

        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                "INSERT INTO scan_history (repo_name, parsed_files, status, timestamp) VALUES (?, ?, ?, ?)",
                (
                    display_name,
                    parsed_files,
                    "SCANNED",
                    datetime.now(timezone.utc).isoformat(),
                ),
            )

        return {
            "repo_name": display_name,
            "parsed_files": parsed_files,
            "status": "SCANNED",
            "breakdown": (
                f"Scanned {parsed_files} supported source/configuration files with lightweight "
                "pattern checks. This is not AST analysis or a complete security audit."
            ),
            "pruningLog": "Skipped common generated/dependency directories and symbolic links.",
            "roadmap": (
                "Review each reported finding manually. Add language-aware static analysis, "
                "dependency auditing, and test coverage before relying on this tool."
            ),
            "vulnerabilities": vulnerabilities,
        }
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Repository scan failed")
        raise HTTPException(
            status_code=500,
            detail="Repository scan failed. Check the backend logs for details.",
        ) from exc
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


@app.get("/api/history")
def get_scan_history():
    """Return the latest scan history."""
    init_db()
    try:
        with sqlite3.connect(DB_PATH) as conn:
            rows = conn.execute(
                "SELECT repo_name, parsed_files, status, timestamp "
                "FROM scan_history ORDER BY id DESC LIMIT 10"
            ).fetchall()
        return [
            {"repo_name": row[0], "parsed_files": row[1], "status": row[2], "timestamp": row[3]}
            for row in rows
        ]
    except sqlite3.Error as exc:
        raise HTTPException(status_code=500, detail="Unable to read scan history.") from exc


@app.post("/api/patch")
def generate_ai_patch(payload: VulnerabilityPatchRequest):
    """Ask the configured local Ollama model for a suggested diff; never fabricate a fallback."""
    prompt = (
        "Act as a security code reviewer. Suggest a minimal unified diff for the described issue. "
        "Do not claim the patch is tested. Return only a diff, or explain that more context is needed.\n"
        f"File: {payload.file_path}\nIssue: {payload.vulnerability}"
    )
    try:
        response = requests.post(
            f"{OLLAMA_HOST}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.2, "num_predict": 500},
            },
            timeout=60,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=503,
            detail="Local Ollama is unavailable; no patch was generated.",
        ) from exc

    try:
        payload_data = response.json()
    except ValueError as exc:
        raise HTTPException(
            status_code=502,
            detail="The local model returned an invalid response; no patch was generated.",
        ) from exc

    suggestion = (
        payload_data.get("response", "").strip()
        if isinstance(payload_data, dict)
        and isinstance(payload_data.get("response"), str)
        else ""
    )
    if not suggestion:
        raise HTTPException(status_code=502, detail="The local model returned an empty suggestion.")
    return {"patch_diff": suggestion, "status": "SUGGESTION_ONLY"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
