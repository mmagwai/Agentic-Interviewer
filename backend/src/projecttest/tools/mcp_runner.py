from crewai.tools import BaseTool
import subprocess
import tempfile
import os


class MCPRunner(BaseTool):
    name: str = "run_code"
    description: str = "Execute candidate code and return the output"

    def _run(self, language: str, code: str) -> str:
        try:
            with tempfile.TemporaryDirectory() as tmp:

                if language.lower() == "python":
                    file_path = os.path.join(tmp, "main.py")

                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(code)

                    result = subprocess.run(
                        ["python", file_path],
                        capture_output=True,
                        text=True,
                        timeout=5,
                    )

                    return result.stdout or result.stderr

                return "Language not supported yet."

        except Exception as e:
            return str(e)
