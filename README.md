# RepoLens: Evidence-Backed Git Repository Explainer

RepoLens is an AI-powered code analysis tool that scans local Git repositories, safely filters files, and generates structured, evidence-backed architectural breakdowns and contributor roadmaps using local LLMs (Ollama + Gemma 3 4B).

## Features
- **Safe Bounded Scanning:** Automatically prunes `.git`, `node_modules`, binary files, and sensitive credentials (`.env`).
- **Evidence-Backed Analysis:** Restricts the AI from hallucinating files by linking every finding directly to actual source file paths.
- **Agent Skill Integration:** Includes a compliant Open Agent Skill (`SKILL.md`) for use with compatible agent runners.
- **Local Inference:** Fully offline-capable using Ollama.

## Installation & Setup

1. **Clone or setup the repository** and install dependencies:
   ```bash
   pip install -r requirements.txt