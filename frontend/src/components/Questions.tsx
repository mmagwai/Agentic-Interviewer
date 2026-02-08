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
      copy[current] = result.score;
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
      <div style={{ width: "100%" }}>
        <h2>Interview Finished</h2>
        <p>
          Final Score: {finalScore} / {questions.length}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "auto",
        width: "100%",
      }}
    >
      {/* =====================
          ANIMATION DEFINITION
         ===================== */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 3;
              transform: translateX(0);
            }
          }
        `}
      </style>
      <style>
        {`
            @keyframes dropIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
            }
        `}
        </style>


      {/* =====================
          QUESTION BLOCK
          key = re-mounts on change
         ===================== */}
      <div
        key={current}
        style={{
          animation: "slideIn 0.35s ease",
        }}
      >
        <h3>
          Question {current + 1} of {questions.length}
        </h3>

        <p>{questions[current]}</p>

        <textarea
          rows={6}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "12px",
            borderRadius: "10px",
            border: "3px solid #d0d5dd",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            resize: "none",
            fontSize: "14px",
            outline: "none",
          }}
          placeholder="Type your answer here..."
          value={answers[current] || ""}
          onChange={(e) => updateAnswer(e.target.value)}
        />
      </div>

      {loading && <p>Evaluating...</p>}

      {/* =====================
           SHOW GRADE
         ===================== */}
      {grade && (
        <>
          <p>
            <b>Score:</b> {grade.score} / 1
          </p>

        <div
        style={{
            marginTop: 20,
            borderRadius: "20px",
            backgroundColor: "rgb(241, 242, 245)",
            padding: "15px",

            animation: "dropIn 0.3s ease",
        }}
        >
        <p>{grade.correct ? "Correct" : "Needs improvement"}</p>
        <p>{grade.feedback}</p>
        </div>


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
            style={{ marginTop: 15, marginBottom: 15 }}
          >
            Continue
          </button>
        </>
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
