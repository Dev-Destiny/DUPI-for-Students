import os
import json
import time
import redis
from typing import Optional
from pydantic import BaseModel, ValidationError
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# Initialize Redis
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
# Handle rediss:// for Upstash
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

# Initialize Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("⚠️ Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set")
    supabase = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class JobPayload(BaseModel):
    documentId: str
    userId: str

from prisma_db import db
from extractor import extractor
from vector_store import vector_store

import asyncio

MAX_RETRIES = 3
INITIAL_BACKOFF = 5 # seconds

async def process_document(doc_id: str, user_id: str) -> None:
    """
    Main logic for document processing with retry mechanism.
    """
    print(f"🚀 Processing document {doc_id} for user {user_id}")
    
    await db.connect()
    try:
        for attempt in range(MAX_RETRIES + 1):
            try:
                # 1. Fetch metadata
                document = await db.get_document(doc_id)
                if not document:
                    print(f"❌ Document {doc_id} not found in DB")
                    return

                # 2. Download from Supabase
                bucket_name = os.getenv("SUPABASE_BUCKET_NAME", "documents")
                storage_path = document.storagePath
                
                if not storage_path:
                    print(f"⚠️ storagePath missing for {doc_id}. Falling back to URL parsing.")
                    storage_path = document.fileUrl.split(f"/public/{bucket_name}/")[-1]
                
                if not supabase:
                    raise Exception("Supabase client not initialized")

                print(f"⬇️ Downloading (Attempt {attempt + 1}): {storage_path}")
                response = supabase.storage.from_(bucket_name).download(storage_path)
                
                # 3. Extract text
                print(f"📄 Extracting text...")
                text = extractor.extract_text(response, document.fileType)
                if not text:
                    raise Exception("No text extracted from document")

                # 4. Chunk & Vectorize
                print(f"🧠 Vectorizing...")
                collection_name = f"doc_{doc_id}"
                metadata = {
                    "documentId": doc_id,
                    "userId": user_id,
                    "title": document.title
                }
                
                chunks_count, safe_collection_name = vector_store.add_document(text, collection_name, metadata)
                
                # 5. Update DB SUCCESS
                await db.update_status(
                    doc_id=doc_id,
                    processed=True,
                    chroma_id=safe_collection_name,
                    chunks=chunks_count
                )
                
                print(f"✅ Success: Processed {chunks_count} chunks for {doc_id}")
                return # Exit on success

            except Exception as e:
                # Check for quota or rate limit errors (429) to provide better logging
                error_msg = str(e)
                if "429" in error_msg or "quota" in error_msg.lower():
                    print(f"🚨 Rate limit or Quota exceeded (Attempt {attempt + 1})")
                
                if attempt < MAX_RETRIES:
                    backoff = INITIAL_BACKOFF * (2 ** attempt)
                    print(f"⚠️ Attempt {attempt + 1} failed: {error_msg}. Retrying in {backoff}s...")
                    await asyncio.sleep(backoff)
                else:
                    raise e # Re-raise to be caught by final failure block

    except Exception as final_error:
        print(f"❌ Final failure for {doc_id} after {MAX_RETRIES + 1} attempts: {str(final_error)}")
        await db.update_status(doc_id=doc_id, processed=False, error=str(final_error))
    finally:
        await db.disconnect()



async def start_worker() -> None:
    print("🤖 DUPI Python Worker started. Listening for jobs...")
    while True:
        try:
            # BLPOP blocks until a job is available in the 'dupi_jobs' list
            # We use 0 as timeout for infinite blocking or small number for periodic checks
            job_data = redis_client.blpop("dupi_jobs", timeout=30)
            
            if job_data:
                _, payload = job_data
                try:
                    data = json.loads(payload)
                    job = JobPayload(**data)
                    await process_document(job.documentId, job.userId)
                except (ValidationError, json.JSONDecodeError) as e:
                    print(f"❌ Invalid Job Payload: {str(e)}")
                    
        except Exception as e:
            print(f"❌ Worker Error: {str(e)}")
            await asyncio.sleep(5)

if __name__ == "__main__":
    import asyncio
    asyncio.run(start_worker())
