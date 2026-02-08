import { useState } from "react";
import { evaluateAnswerApi } from "../services/api";

interface Props {
  questions: string[];
  onFinish: (score: number) => void;
}

export default function Questions({ questions, onFinish }: Props) {

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [grade, setGrade] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  if (!questions.length) return null;

  // =====================
  // Evaluate answer
  // =====================
  const handleNext = async () => {
    const answer = answers[current];

    if (!answer) {
      alert("Please type an answer");
      return;
    }

    setLoading(true);

    try {
      const result = await evaluateAnswerApi(
        questions[current],
        answer
      );

      setGrade(result);

      const copy = [...results];
      copy[current] = result.score; // 0 or 1
      setResults(copy);
    } catch (e) {
      alert("Failed to evaluate");
    }

    setLoading(false);
  };

  const updateAnswer = (value: string) => {
    const copy = [...answers];
    copy[current] = value;
    setAnswers(copy);
  };

  // =====================
  // If interview finished
  // =====================
  if (finalScore !== null) {
    return (
      <div       style={{
  
     }}>
        <h2>Interview Finished 🎉</h2>
        <p>
          Final Score: {finalScore} / {questions.length}
        </p>
      </div>
    );
  }

  return (
    <div     style={{
      maxWidth: 1000,
      margin: "auto",
     width: "100%"
    }} >
      <h3>
        Question {current + 1} of {questions.length}
      </h3>

      <p>{questions[current]}</p>

      <textarea
        rows={6}
        style={{ width: "100%", marginTop: 10 }}
        placeholder="Type your answer here..."
        value={answers[current] || ""}
        onChange={(e) => updateAnswer(e.target.value)}
      />

      {loading && <p>Evaluating...</p>}

      {/* =====================
           SHOW GRADE
         ===================== */}
      {grade && (
        <div style={{ marginTop: 20 }}>
          <p>Score: {grade.score} / 1</p>
          <p>{grade.correct ? "Correct" : "Needs improvement"}</p>
          <p>{grade.feedback}</p>

          <button
            onClick={() => {
              setGrade(null);

              if (current < questions.length - 1) {
                setCurrent(current + 1);
              } else {
                const total = results.reduce((a, b) => a + b, 0);
                setFinalScore(total);
                onFinish(total); 
              }
            }}
            style={{ marginTop: 10 }}
          >
            Continue
          </button>
        </div>
      )}

      {/* =====================
           NEXT BUTTON
         ===================== */}
      {!grade && (
        <button onClick={handleNext} style={{ marginTop: 10 }}>
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      )}
    </div>
  );
}
