import { useState } from "react";
import type { Candidate } from "./types/candidate";
import { analyzeCV, startInterviewApi } from "./services/api";
import UploadCV from "./components/UploadCV";
import TechSelector from "./components/TechSelector";
import Questions from "./components/Questions";
import CodingChallenge from "./components/CodingChallenge";
import { getCodingChallengeApi } from "./services/api";


function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [challenge, setChallenge] = useState("");


  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await analyzeCV(file);
      setCandidate(data);
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  };

const startInterview = async (tech: string) => {
  if (!file) return;

  setSelectedTech(tech);
  setChallenge(""); // reset previous challenge
  setQuestions([]);

    try {
      // 1️ Questions
      const data = await startInterviewApi(file, tech);
      setQuestions(data.questions || []);

    } catch (err) {
      alert("Failed to start interview");
    }
  };

const handleInterviewFinish = async () => {
  if (!selectedTech || !candidate || !file) return;

  try {
    const challengeData = await getCodingChallengeApi(
      selectedTech,
      candidate.experience_level,
      file
    );

    setChallenge(challengeData.challenge || "");
  } catch (err) {
    alert("Failed to load coding challenge");
  }
};


  return (
    <div style={{ padding: 40 }}>
      <h1>AI Technical Interviewer</h1>

      <UploadCV
        loading={loading}
        onFileChange={setFile}
        onUpload={handleUpload}
      />

      {candidate && (
        <>
          <h2>{candidate.candidate_name}</h2>
          <p>Level: {candidate.experience_level}</p>

          <TechSelector
            techs={candidate.tech_stack}
            selected={selectedTech}
            onSelect={startInterview}
          />
        </>
      )}

      <Questions questions={questions}  onFinish={handleInterviewFinish} />
      <CodingChallenge challenge={challenge} />

    </div>
  );
}

export default App;
