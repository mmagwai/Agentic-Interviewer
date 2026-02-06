from pathlib import Path
from pypdf import PdfReader
from docx import Document

def read_cv_file(file_path: str) -> str:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    if path.suffix.lower() == ".pdf":
        return _read_pdf(path)

    elif path.suffix.lower() == ".docx":
        return _read_docx(path)

    elif path.suffix.lower() == ".txt":
        return _read_txt(path)

    else:
        raise ValueError("Unsupported file type. Use PDF, DOCX, or TXT.")


def _read_pdf(path: Path) -> str:
    reader = PdfReader(str(path))
    text = []
    for page in reader.pages:
        if page.extract_text():
            text.append(page.extract_text())
    return "\n".join(text)


def _read_docx(path: Path) -> str:
    doc = Document(str(path))
    return "\n".join(p.text for p in doc.paragraphs)


def _read_txt(path: Path) -> str:
    return path.read_text(encoding="utf-8")
