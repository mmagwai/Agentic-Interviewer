import { useState } from "react";

interface Candidate {
  candidate_name: string;
  experience_level: string;
  tech_stack: string[];
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
const [questions, setQuestions] = useState<string[]>([]);


const startInterview = async (tech: string) => {
  if (!file) return;

  setSelectedTech(tech);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("selected_tech", tech);

  try {
    const res = await fetch("http://127.0.0.1:8000/start-interview", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    // ⚠️ adjust if backend returns differently
    setQuestions(data.questions || []);
  } catch (err) {
    console.error(err);
    alert("Failed to start interview");
  }
};

const handleUpload = async () => {
  if (!file) return;

  setLoading(true);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:8000/analyze-cv", {
      method: "POST",
      body: formData,
    });

    console.log("STATUS:", response.status);

    const text = await response.text();
    console.log("RAW RESPONSE:", text);

    if (!response.ok) {
      throw new Error(text);
    }

    const data = JSON.parse(text);
    setCandidate(data);
  } catch (err: any) {
    console.error("REAL ERROR:", err.message);
    alert(err.message);   // 👈 now you see truth
  }

  setLoading(false);
};



return (
  <div style={styles.container}>
    <h1>AI Technical Interviewer</h1>

    {/* Upload */}
    <input
      type="file"
      accept=".pdf,.doc,.docx,.txt"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
    />

    <button onClick={handleUpload} disabled={loading}>
      {loading ? "Analyzing..." : "Upload CV"}
    </button>

    {/* Candidate Info */}
    {candidate && (
      <div style={styles.card}>
        <h2>{candidate.candidate_name}</h2>
        <p>Level: {candidate.experience_level}</p>

        <h3>Select Technology</h3>

        {/* BUTTONS */}
        <div style={styles.techList}>
          {candidate.tech_stack?.map((tech: string) => (
            <button
              key={tech}
              style={{
                ...styles.techButton,
                background:
                  selectedTech === tech ? "#16a34a" : "#4f46e5",
              }}
              onClick={() => startInterview(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
    )}

    {/*  QUESTIONS LIVE OUTSIDE */}
    {questions.length > 0 && (
      <div style={styles.card}>
        <h3>Interview Questions</h3>
        <ol>
          {questions.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ol>
      </div>
    )}
  </div>
);

}

const styles = {
  container: {
    padding: "40px",
    fontFamily: "Arial",
  },
  card: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },
  techList: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  techButton: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
  },
};

export default App;
