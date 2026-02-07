interface Props {
  techs: string[];
  selected: string | null;
  onSelect: (tech: string) => void;
}

export default function TechSelector({ techs, selected, onSelect }: Props) {
  return (
    <div>
      {techs.map((tech) => (
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
          }}
        >
          {tech}
        </button>
      ))}
    </div>
  );
}
