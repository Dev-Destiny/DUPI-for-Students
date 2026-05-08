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
        self.port = os.getenv("CHROMA_PORT", "8000")
        self.tenant = os.getenv("CHROMA_TENANT", "")
        self.database = os.getenv("CHROMA_DATABASE", "default_database")
        self.api_key = os.getenv("CHROMA_API_KEY", "")

        if self.api_key and self.tenant:
            # Chroma Cloud configuration
            self.client = chromadb.CloudClient(
                tenant=self.tenant,
                database=self.database,
                # settings=Settings(
                #     chroma_client_auth_provider="chromadb.auth.token_authn.TokenAuthClientProvider",
                #     chroma_client_auth_credentials=self.api_key
                # )
                api_key=self.api_key
            )
        else:
            # Local/Standard configuration
            self.client = chromadb.HttpClient(host=self.host, port=int(self.port))
        
        # Using Google Gemini Embeddings (API-based, saves memory)
        print("💡 Loading Google Gemini Embeddings (text-embedding-004)...")
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            google_api_key=api_key
        )
        
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
        Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            collection_name=safe_name,
            client=self.client
        )
        
        return len(chunks), safe_name

    def get_context(self, collection_name: str, query: str = "main summary and core concepts", k: int = 10):
        """
        Retreive relevant chunks from a document collection.
        """
        safe_name = collection_name.replace("-", "_")[:63]
        vector_db = Chroma(
            client=self.client,
            collection_name=safe_name,
            embedding_function=self.embeddings
        )
        docs = vector_db.similarity_search(query, k=k)
        return "\n\n".join([doc.page_content for doc in docs])

    def delete_collection(self, collection_name: str):
        """
        Deletes a collection from ChromaDB.
        """
        safe_name = collection_name.replace("-", "_")[:63]
        try:
            self.client.delete_collection(name=safe_name)
            return True
        except Exception as e:
            print(f"⚠️ Error deleting collection {safe_name}: {str(e)}")
            return False

vector_store = VectorStoreManager()
