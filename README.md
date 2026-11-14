# RepoLens — Evidence-Backed Git Repository Explainer

RepoLens is a local-first project intended to help developers understand unfamiliar Git repositories. It combines repository inspection with an open-weight language model workflow and aims to keep explanations traceable to source files.

## Project goals

- Inspect a local repository and summarize its structure.
- Exclude generated, binary, dependency, and sensitive files where configured.
- Use repository content as context for explanations.
- Provide source-file references so developers can verify generated answers.
- Support a local model runtime through Ollama.
- Package reusable agent guidance using the open Agent Skill `SKILL.md` convention.

## Model and runtime

The project has been developed around Ollama and the Gemma model family. Check the current configuration and source code for the exact model tag, runtime settings, and hardware requirements before running it.

## Responsible use

- Remove secrets and credentials from repositories before scanning.
- Verify every explanation against the referenced source files.
- Treat generated suggestions and patches as drafts requiring human review.
- Do not treat repository scanning as a complete security audit.
- Do not rely on generated output as proof that code is safe or production-ready.

## Development status

This README describes the project's goals and intended workflow. The implementation in this repository is authoritative for currently supported commands, languages, checks, and features. Update this document whenever those capabilities change.

## License

See the repository's `LICENSE` file for the applicable software license. Any model used by the project may have separate terms.
