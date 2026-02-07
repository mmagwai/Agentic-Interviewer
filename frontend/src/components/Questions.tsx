import { useState } from "react";

interface Props {
  questions: string[];
}

export default function Questions({ questions }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  if (!questions.length) return null;

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      alert("Interview finished 🎉");
      console.log("Answers:", answers);
    }
  };

  const updateAnswer = (value: string) => {
    const copy = [...answers];
    copy[current] = value;
    setAnswers(copy);
  };

  return (
    <div style={{ marginTop: 40 }}>
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

      <button onClick={handleNext} style={{ marginTop: 10 }}>
        {current === questions.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
}
