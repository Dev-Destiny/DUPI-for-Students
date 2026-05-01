from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

app = FastAPI(title="Studify Document Processor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from generation import generation_service
from vector_store import vector_store

@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Studify AI Processor is online"}

@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "healthy", "service": "processor"}

@app.post("/generate/test")
async def generate_test(collection_id: str, num_questions: int = 10, difficulty: str = "medium", topic: str = "", question_type: str = "mcq"):
    """
    Generate a practice test from a processed document.
    """
    return await generation_service.generate_test(collection_id, num_questions, difficulty, topic, question_type)

@app.post("/generate/flashcards")
async def generate_flashcards(collection_id: str, num_cards: int = 15, difficulty: str = "medium", topic: str = ""):
    """
    Generate a flashcard set from a processed document.
    """
    return await generation_service.generate_flashcards(collection_id, num_cards, difficulty, topic)

@app.delete("/vector-store/{collection_id}")
async def delete_collection(collection_id: str):
    """
    Delete a collection from vector store.
    """
    success = vector_store.delete_collection(collection_id)
    return {"success": success, "collection_id": collection_id}

@app.post("/generate/summary")
async def generate_summary(collection_id: str):
    """
    (Re-)generate a summary for an already-processed document from its vector store context.
    """
    context = vector_store.get_context(collection_id, k=20)
    if not context:
        return {"summary": "No content found in vector store for this document."}
    summary = await generation_service.generate_summary(context)
    return {"summary": summary}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
