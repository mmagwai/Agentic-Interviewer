import { useState } from "react";
import Editor from "@monaco-editor/react";
import { runCodeApi, gradeCodeApi } from "../services/api";

interface Props {
  challenge: string;
}

export default function CodingChallenge({ challenge }: Props) {
  const [code, setCode] = useState("// write your solution here");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  if (!challenge) return null;

  // ================= RUN =================
  const run = async () => {
    setLoading(true);
    try {
      const res = await runCodeApi(language, code);
      setOutput(res.output);
    } catch {
      setOutput("Execution failed");
    }
    setLoading(false);
  };

  // ================= SUBMIT =================
  const submit = async () => {
    setLoading(true);
    try {
      const res = await gradeCodeApi(challenge, code, output);
      setResult(res);
    } catch {
      alert("Grading failed");
    }
    setLoading(false);
  };

  if (result) {
    return (
      <div style={{ marginTop: 40 }}>
        <h2>Challenge Result</h2>
        <div className="gradeCard">
          <p>Score: {result.score}</p>
          <p>{result.verdict}</p>
          <p>{result.feedback}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Coding Challenge</h2>

      <pre style={{ background: "#111", color: "#0f0", padding: 10 }}>
        {challenge}
      </pre>

      {/* Language */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ marginBottom: 10 }}
      >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      {/* Monaco */}
      <Editor
        height="400px"
        language={language}
        value={code}
        onChange={(v) => setCode(v || "")}
        theme="vs-dark"
      />

      <button onClick={run} className="primaryButton">
        Run Code
      </button>

      <button onClick={submit} className="primaryButton">
        Submit
      </button>

      <h3>Output</h3>
      <pre style={{ background: "#000", color: "#0f0", padding: 10 }}>
        {output}
      </pre>

      {loading && <p>Working...</p>}
    </div>
  );
}
