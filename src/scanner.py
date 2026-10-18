import os
import json

class RepositoryScanner:
    def __init__(self, config_path="config.json"):
        with open(config_path, "r") as f:
            self.config = json.load(f)["scanner"]
        
        self.excluded_dirs = set(self.config.get("excluded_dirs", [".git", "node_modules", "venv", "__pycache__"]))
        self.excluded_files = set(self.config.get("excluded_files", [".env", ".DS_Store"]))
        self.max_file_size_kb = self.config.get("max_file_size_kb", 100)

    def scan(self, repo_path: str) -> dict:
        manifest = []
        files = {}
        total_chars = 0

        for root, dirs, filenames in os.walk(repo_path):
            dirs[:] = [d for d in dirs if d not in self.excluded_dirs]

            for filename in filenames:
                if filename in self.excluded_files:
                    continue
                
                full_path = os.path.join(root, filename)
                rel_path = os.path.relpath(full_path, repo_path)

                try:
                    file_size_kb = os.path.getsize(full_path) / 1024
                    if file_size_kb > self.max_file_size_kb:
                        continue
                except OSError:
                    continue

                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                except Exception:
                    continue

                manifest.append({"path": rel_path, "size_kb": round(file_size_kb, 2)})
                files[rel_path] = content
                total_chars += len(content)

        return {
            "manifest": manifest,
            "files": files,
            "total_chars": total_chars
        }