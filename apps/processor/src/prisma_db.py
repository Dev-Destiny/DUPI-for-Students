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

    async def update_status(self, doc_id: str, processed: bool, error: str = None, chroma_id: str = None, chunks: int = 0, summary: str = None):
        data_update = {
            "processed": processed,
            "processingError": error,
            "chromaCollectionId": chroma_id,
            "chunkCount": chunks
        }
        if summary is not None:
            data_update["summary"] = summary

        await self.db.document.update(
            where={"id": doc_id},
            data=data_update
        )

# Global instance
db = PrismaDB()
