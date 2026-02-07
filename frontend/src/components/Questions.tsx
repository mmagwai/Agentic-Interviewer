interface Props {
  questions: string[];
}

export default function Questions({ questions }: Props) {
  if (!questions.length) return null;

  return (
    <div>
      <h3>Interview Questions</h3>
      <ol>
        {questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ol>
    </div>
  );
}
