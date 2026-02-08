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
    <div         style={{
            marginTop: 20,
            borderRadius: "20px",
            backgroundColor: "rgb(241, 242, 245)",
            padding: "15px",
            paddingBottom: "15px",
            marginBottom: "20px"
        }}>
      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Result</h3>
          <p>Score: {result.score}</p>
          <p>{result.verdict}</p>
          <p>{result.feedback}</p>
        </div>
      )}
      </div>
    </div>
  );
}
