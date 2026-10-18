---
name: repo-explainer
description: Analyzes Git repositories to produce evidence-backed architecture maps, contributor roadmaps, and risk explanations using local LLMs.
inputs:
  repo_path:
    type: string
    description: Path to the root of the Git repository to analyze.
    required: true
outputs:
  report:
    type: string
    description: Markdown-formatted technical repository analysis report.
---

# RepoLens Repository Explainer Skill

## Overview
This skill guides an AI agent through securely scanning a code repository, filtering out sensitive or binary files, and prompting a local Ollama model (such as Gemma) to generate an evidence-backed architectural breakdown without hallucinating files.

## Workflow Instructions
1. **Verify Target:** Confirm the target repository path exists and contains readable source code files.
2. **Scan Repository:** Run the internal scanner to generate a file manifest while respecting context budgets and excluding `.git`, `node_modules`, and secrets.
3. **Analyze Structure:** Package the scanned file contents and prompt the local engine to map the architecture, execution flow, findings, and contributor roadmap.
4. **Format Output:** Present the final findings clearly with strict file path evidence grounding.