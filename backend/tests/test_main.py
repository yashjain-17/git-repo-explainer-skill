import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

import main  # noqa: E402


class FakeResponse:
    def __init__(self, payload):
        self.payload = payload

    def raise_for_status(self):
        return None

    def json(self):
        return self.payload


class RepoLensApiTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_path = Path(self.temp_dir.name)
        self.db_patch = patch.object(main, "DB_PATH", self.temp_path / "test-history.db")
        self.db_patch.start()
        main.init_db()
        self.client = TestClient(main.app)

    def tearDown(self):
        self.client.close()
        self.db_patch.stop()
        self.temp_dir.cleanup()

    def test_health_reports_available_ollama_models(self):
        with patch.object(
            main.requests,
            "get",
            return_value=FakeResponse({"models": [{"name": "gemma3:4b"}]}),
        ):
            response = self.client.get("/api/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ONLINE")
        self.assertEqual(response.json()["active_models"], ["gemma3:4b"])

    def test_health_reports_offline_when_ollama_is_unavailable(self):
        import requests

        with patch.object(main.requests, "get", side_effect=requests.ConnectionError):
            response = self.client.get("/api/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "OFFLINE")
        self.assertEqual(response.json()["active_models"], [])

    def test_scan_detects_eval_and_unquoted_dotenv_credentials(self):
        repository = self.temp_path / "sample-repository"
        repository.mkdir()
        (repository / "main.py").write_text("value = eval(input())\n", encoding="utf-8")
        (repository / ".env").write_text(
            "API_KEY=sk_test_12345678901234567890\n",
            encoding="utf-8",
        )

        response = self.client.post("/api/scan", json={"repo_path": str(repository)})

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["parsed_files"], 2)
        self.assertEqual(payload["status"], "SCANNED")
        self.assertEqual(
            {finding["file"] for finding in payload["vulnerabilities"]},
            {"main.py", ".env"},
        )
        self.assertTrue(all("sk_test_" not in finding["message"] for finding in payload["vulnerabilities"]))

    def test_scan_rejects_malformed_github_port_as_bad_request(self):
        response = self.client.post(
            "/api/scan",
            json={"repo_path": "https://github.com:not-a-port/owner/repository"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("public https://github.com", response.json()["detail"])

    def test_remote_clone_errors_are_not_returned_to_client(self):
        with patch.object(
            main.git.Repo,
            "clone_from",
            side_effect=RuntimeError("sensitive internal clone detail"),
        ):
            response = self.client.post(
                "/api/scan",
                json={"repo_path": "https://github.com/owner/repository"},
            )

        self.assertEqual(response.status_code, 400)
        self.assertIn("publicly accessible", response.json()["detail"])
        self.assertNotIn("sensitive internal clone detail", response.text)

    def test_remote_clone_uses_a_finite_execution_timeout(self):
        with patch.object(main.git.Repo, "clone_from") as clone_from:
            response = self.client.post(
                "/api/scan",
                json={"repo_path": "https://github.com/owner/repository"},
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(clone_from.call_args.kwargs["kill_after_timeout"], 120)

    def test_scan_enforces_total_analyzed_source_limit(self):
        repository = self.temp_path / "large-source-repository"
        repository.mkdir()
        (repository / "first.py").write_text("x=1", encoding="utf-8")
        (repository / "second.py").write_text("y=2", encoding="utf-8")

        with patch.object(main, "MAX_TOTAL_SOURCE_BYTES", 5):
            response = self.client.post("/api/scan", json={"repo_path": str(repository)})

        self.assertEqual(response.status_code, 413)
        self.assertIn("analyzed-source limit", response.json()["detail"])

    def test_scan_rejects_non_github_remote_urls(self):
        response = self.client.post(
            "/api/scan",
            json={"repo_path": "https://example.com/owner/repository"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("public https://github.com", response.json()["detail"])

    def test_scan_rejects_blank_and_missing_local_paths(self):
        blank = self.client.post("/api/scan", json={"repo_path": "   "})
        missing = self.client.post(
            "/api/scan",
            json={"repo_path": str(self.temp_path / "does-not-exist")},
        )

        self.assertEqual(blank.status_code, 422)
        self.assertEqual(missing.status_code, 400)

    def test_scan_history_contains_completed_scan(self):
        repository = self.temp_path / "history-repository"
        repository.mkdir()
        (repository / "app.py").write_text("print('hello')\n", encoding="utf-8")

        scan = self.client.post("/api/scan", json={"repo_path": str(repository)})
        history = self.client.get("/api/history")

        self.assertEqual(scan.status_code, 200)
        self.assertEqual(history.status_code, 200)
        self.assertEqual(len(history.json()), 1)
        self.assertEqual(history.json()[0]["parsed_files"], 1)

    def test_patch_endpoint_returns_model_output_as_suggestion_only(self):
        with patch.object(
            main.requests,
            "post",
            return_value=FakeResponse({"response": "--- a/app.py\n+++ b/app.py"}),
        ):
            response = self.client.post(
                "/api/patch",
                json={"file_path": "app.py", "vulnerability": "Unsafe eval usage"},
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "SUGGESTION_ONLY")
        self.assertIn("--- a/app.py", response.json()["patch_diff"])

    def test_patch_endpoint_rejects_invalid_model_json(self):
        class InvalidJsonResponse(FakeResponse):
            def json(self):
                raise ValueError("invalid JSON")

        with patch.object(
            main.requests,
            "post",
            return_value=InvalidJsonResponse({}),
        ):
            response = self.client.post(
                "/api/patch",
                json={"file_path": "app.py", "vulnerability": "Unsafe eval usage"},
            )

        self.assertEqual(response.status_code, 502)
        self.assertIn("invalid response", response.json()["detail"])
        self.assertNotIn("patch_diff", response.json())

    def test_patch_endpoint_reports_unavailable_ollama(self):
        import requests

        with patch.object(main.requests, "post", side_effect=requests.ConnectionError):
            response = self.client.post(
                "/api/patch",
                json={"file_path": "app.py", "vulnerability": "Unsafe eval usage"},
            )

        self.assertEqual(response.status_code, 503)
        self.assertIn("no patch was generated", response.json()["detail"])


if __name__ == "__main__":
    unittest.main()
