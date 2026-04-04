from prisma import Prisma
import asyncio

class PrismaDB:
    def __init__(self):
        self.db = Prisma()

    async def connect(self):
        if not self.db.is_connected():
            await self.db.connect()

    async def disconnect(self):
        if self.db.is_connected():
            await self.db.disconnect()

    async def get_document(self, doc_id: str):
        return await self.db.document.find_unique(where={"id": doc_id})

    async def update_status(self, doc_id: str, processed: bool, error: str = None, chroma_id: str = None, chunks: int = 0):
        await self.db.document.update(
            where={"id": doc_id},
            data={
                "processed": processed,
                "processingError": error,
                "chromaCollectionId": chroma_id,
                "chunkCount": chunks
            }
        )

# Global instance
db = PrismaDB()
