import "../App.css";

interface Props {
  loading: boolean;
  onFileChange: (file: File) => void;
  onUpload: () => void;
}

export default function UploadCV({ loading, onFileChange, onUpload }: Props) {
  return (
    <div className="uploadContainer">
      <h2 className="uploadTitle">Upload your CV</h2>

      <p className="uploadSubtitle">
        Supported formats: PDF, DOC, DOCX, TXT
      </p>

      {/* INLINE ROW */}
      <div className="uploadRow">
        <input
          className="fileInput"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) =>
            e.target.files && onFileChange(e.target.files[0])
          }
        />

        <button
          className="primaryButton"
          onClick={onUpload}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Upload CV"}
        </button>
      </div>
    </div>
  );
}
