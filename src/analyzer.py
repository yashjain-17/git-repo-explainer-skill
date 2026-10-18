import json
from src.scanner import RepositoryScanner
from src.engine import OllamaEngine

class RepositoryAnalyzer:
    def __init__(self, config_path="config.json"):
        self.scanner = RepositoryScanner(config_path)
        self.engine = OllamaEngine(config_path)

    def analyze(self, repo_path: str) -> str:
        scan_data = self.scanner.scan(repo_path)
        manifest = scan_data["manifest"]
        files = scan_data["files"]

        manifest_str = json.dumps(manifest, indent=2)

        code_context = ""
        for path, content in files.items():
            code_context += f"\n--- FILE: {path} ---\n{content}\n"

        prompt = f"""You are an expert technical code auditor and repository analyst. 
Analyze the following repository based ONLY on the provided files and manifest. Do NOT invent files, dependencies, or architectural relationships that are not explicitly supported by the code.

### REPOSITORY MANIFEST:
{manifest_str}

### REPOSITORY FILES:
{code_context}

### REQUIRED OUTPUT FORMAT:
Provide your analysis using the following exact structure:
1. Repository Overview
   - Purpose, languages, entry points, and major directories.
2. Architecture and Execution Flow
   - How the important modules interact, with direct references to actual files.
3. Evidence-Backed Findings
   - List key findings or features, linking each to its source file path and marking whether it is an observed fact or AI hypothesis.
4. Contributor Roadmap
   - Recommended reading order and suggested next steps for joining the project.
"""

        report = self.engine.generate(prompt)
        return report