from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DUPI Document Processor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "DUPI AI Processor is online"}

@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "healthy", "service": "processor"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
