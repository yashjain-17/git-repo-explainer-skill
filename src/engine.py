import json
import requests

class OllamaEngine:
    def __init__(self, config_path="config.json"):
        with open(config_path, "r") as f:
            self.config = json.load(f)["ollama"]
        
        self.endpoint = self.config["endpoint"]
        self.model = self.config["model"]
        self.timeout = self.config["timeout"]

    def generate(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }

        try:
            response = requests.post(self.endpoint, json=payload, timeout=self.timeout)
            response.raise_for_status()
            data = response.json()
            return data.get("response", "")
        except requests.exceptions.ConnectionError:
            raise ConnectionError(
                f"Could not connect to Ollama at {self.endpoint}. Ensure Ollama is running locally."
            )
        except requests.exceptions.Timeout:
            raise TimeoutError(f"Ollama request timed out after {self.timeout} seconds.")
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"Ollama API error: {e}")