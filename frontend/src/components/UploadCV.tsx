import "../App.css";

interface Props {
  loading: boolean;
  onFileChange: (file: File) => void;
  onUpload: () => void;
}

export default function UploadCV({ loading, onFileChange, onUpload }: Props) {
  return (
    <div style={{width: "100%"}}>
    <input
    className="fileInput"
    type="file"
    accept=".pdf,.doc,.docx,.txt"
    onChange={(e) => e.target.files && onFileChange(e.target.files[0])}
    />


      <button onClick={onUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Upload CV"}
      </button>
    </div>
  );
}
