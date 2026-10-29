# 🛡️ Repolens Enterprise AST & Local AI Engine

An enterprise-grade, local-first code intelligence and security auditing platform featuring deep AST parsing, static vulnerability analysis, and automated AI code patching powered by local Ollama LLMs (Gemma 2).

## 🚀 Key Features
* **Local-First Architecture**: Runs securely on your local machine using FastAPI, SQLite, and an Ollama daemon.
* **Real Git Ingestion & AST Parsing**: Clones and inspects local or remote repositories using GitPython, pruning unwanted binary artifacts and `node_modules`.
* **Security Vulnerability Matrix**: Scans codebases for hardcoded secrets, unsafe `eval()` calls, and CLI injection risks.
* **AI Remediation Patches**: Integrates with local Gemma 2 models to synthesize clean, production-ready git diff patches for detected vulnerabilities.
* **Scan History & Export**: Persists audit sessions via SQLite and enables instant JSON report downloads.

## 🛠️ Tech Stack
* **Backend**: Python, FastAPI, GitPython, SQLite, Uvicorn, Requests
* **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons
* **AI Engine**: Local Ollama Daemon (Gemma 2)

## 📦 Quick Start

### 1. Start Ollama Daemon
```bash
ollama serve
