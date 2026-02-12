import { useState } from "react";
import type { Candidate } from "./types/candidate";
import { analyzeCV, startInterviewApi, getCodingChallengeApi } from "./services/api";

import UploadCV from "./components/UploadCV";
import TechSelector from "./components/TechSelector";
import Questions from "./components/Questions";
import CodingChallenge from "./components/CodingChallenge";
import icon1 from "./assets/images/icon1.png";


function App() {
  const [step, setStep] = useState(1);   // STEP CONTROL

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [challenge, setChallenge] = useState("");

  // =============================
  // STEP 1 → Upload CV
  // =============================
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const data = await analyzeCV(file);
      setCandidate(data);
      setStep(2);   // move to tech selection
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  };

  // =============================
  // STEP 2 → Choose Tech
  // =============================
  const startInterview = async (tech: string) => {
    if (!file) return;

    setSelectedTech(tech);
    setQuestions([]);

    try {
      const data = await startInterviewApi(file, tech);
      setQuestions(data.questions || []);
      setStep(3);   // move to questions
    } catch (err) {
      alert("Failed to start interview");
    }
  };

  // =============================
  // STEP 3 → Interview Finished
  // =============================
  const handleInterviewFinish = async () => {
    if (!selectedTech || !candidate || !file) return;

    try {
      const challengeData = await getCodingChallengeApi(
        selectedTech,
        candidate.experience_level,
        file
      );

      setChallenge(challengeData.challenge || "");
      setStep(4);   // move to coding challenge
    } catch (err) {
      alert("Failed to load coding challenge");
    }
  };

return (
  <div className="app">
    <div className="container">
      <img src={icon1} alt="App icon" className="logo" />
      <h1>AI Technical Interviewer</h1>

      {step === 1 && (
        <UploadCV
          loading={loading}
          onFileChange={setFile}
          onUpload={handleUpload}
        />
      )}

      {step === 2 && candidate && (
        <>
          <h2>{candidate.candidate_name}</h2>
          <p className="muted">Level: {candidate.experience_level}</p>

          <TechSelector
            techs={candidate.tech_stack}
            selected={selectedTech}
            onSelect={startInterview}
          />
        </>
      )}

      {step === 3 && (
        <Questions
          questions={questions}
          onFinish={handleInterviewFinish}
        />
      )}

      {step === 4 && selectedTech && (
        <CodingChallenge
          challenge={challenge}
          language={selectedTech}
        />
      )}
    </div>
  </div>
);


}

export default App;
