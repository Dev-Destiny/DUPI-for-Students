import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Load environment variables from .env
load_dotenv()

import google.generativeai as genai

def test_google_embeddings():
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("[ERROR] GOOGLE_API_KEY or GEMINI_API_KEY not found in .env")
        return

    print("--- Listing Available Models ---")
    try:
        genai.configure(api_key=api_key)
        for m in genai.list_models():
            if 'embedContent' in m.supported_generation_methods:
                print(f"Found embedding model: {m.name}")
    except Exception as e:
        print(f"Error listing models: {str(e)}")
        return

    # Testing the available model
    print("\n--- Testing Model: models/gemini-embedding-2 ---")
    try:
        model_name = "models/gemini-embedding-2"
        embeddings = GoogleGenerativeAIEmbeddings(
            model=model_name,
            google_api_key=api_key
        )
        vectors = embeddings.embed_documents(["Hello world", "Studify is the best learning platform."])
        print(f"SUCCESS with {model_name}! Dimension: {len(vectors[0])}")
        print(f"Sample vector snippet: {vectors[0][:5]}...")
    except Exception as e:
        print(f"Final Test failed: {str(e)}")
        if "429" in str(e):
            print("Quota exceeded - you are hitting rate limits.")

if __name__ == "__main__":
    test_google_embeddings()
