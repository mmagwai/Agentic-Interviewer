interface Props {
  techs: string[];
  selected: string | null;
  onSelect: (tech: string) => void;
}

export default function TechSelector({ techs, selected, onSelect }: Props) {
  return (
    <div>
      {/* animation definition */}
      <style>
        {`
          @keyframes floatUp {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {techs.map((tech, index) => (
        <button
          key={tech}
          onClick={() => onSelect(tech)}
          style={{
            margin: 5,
            padding: 10,
            background: selected === tech ? "#16a34a" : "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: 8,

            // animation magic
            opacity: 0,
            animation: `floatUp 0.4s ease forwards`,
            animationDelay: `${index * 0.08}s`,
          }}
        >
          {tech}
        </button>
      ))}
    </div>
  );
}
