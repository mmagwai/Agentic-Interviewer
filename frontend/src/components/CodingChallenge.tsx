import { useState } from "react";
import { gradeCodeApi } from "../services/api";

interface Props {
  challenge: string;
}

export default function CodingChallenge({ challenge }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  if (!challenge) return null;

  const submit = async () => {
    if (!file) {
      alert("Upload your solution file");
      return;
    }

    setLoading(true);

    try {
      const res = await gradeCodeApi(challenge, file);
      setResult(res);
    } catch {
      alert("Failed to grade");
    }

    setLoading(false);
  };

 
  // After grading we show only the result

  if (result) {
    return (
      <div style={{ marginTop: 40 }}>
        <h2>Challenge Result</h2>

        <div className="gradeCard" style={{ marginBottom: "20px" }}>
          <p>Score: {result.score}</p>
          <p>{result.verdict}</p>
          <p>{result.feedback}</p>
        </div>
      </div>
    );
  }

  // =============================
  // NORMAL VIEW (before grading)
  // =============================
  return (
    <div style={{ marginTop: 40 }}>
      <h2>Coding Challenge</h2>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 15,
          borderRadius: 10,
          whiteSpace: "pre-wrap",
        }}
      >
        {challenge}
      </pre>

      <input
        type="file"
        className="fileInput"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{ marginTop: 15 }}
      />

      <br />

      <button onClick={submit} style={{ marginTop: 10 }}>
        Submit Solution
      </button>

      {loading && <p>Grading...</p>}
    </div>
  );
}
