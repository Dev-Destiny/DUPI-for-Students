import os
import chromadb
from chromadb.config import Settings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document as LCDocument

class VectorStoreManager:
    def __init__(self):
        self.host = os.getenv("CHROMA_HOST", "localhost")
        self.port = int(os.getenv("CHROMA_PORT", 8000))
        self.client = chromadb.HttpClient(host=self.host, port=self.port)
        # Using Google Generative AI embeddings
        api_key = os.getenv("GEMINI_API_KEY")
        self.embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001", google_api_key=api_key)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )

    def add_document(self, text: str, collection_name: str, metadata: dict):
        # Create or update collection
        # Note: Chroma collection names must be 3-63 chars, start/end with alnum
        safe_name = collection_name.replace("-", "_")[:63]
        
        # Split text into chunks
        chunks = self.text_splitter.create_documents([text], metadatas=[metadata])
        
        # Use LangChain's Chroma wrapper
        vector_db = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            collection_name=safe_name,
            client=self.client
        )
        
        return len(chunks), safe_name

vector_store = VectorStoreManager()
