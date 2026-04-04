import io
from pypdf import PdfReader
from docx import Document as DocxDocument

class DocumentExtractor:
    @staticmethod
    def extract_text(file_bytes: bytes, file_type: str) -> str:
        text = ""
        if "application/pdf" in file_type or file_type.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                text += page.extract_text() + "\n"
        elif "application/vnd.openxmlformats-officedocument.wordprocessingml.document" in file_type or file_type.endswith(".docx"):
            doc = DocxDocument(io.BytesIO(file_bytes))
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            # Fallback to plain text
            text = file_bytes.decode("utf-8", errors="ignore")
        
        return text.strip()

extractor = DocumentExtractor()
