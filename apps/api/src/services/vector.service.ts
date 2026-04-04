import { ChromaClient, Collection } from "chromadb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ApiError } from "../utils/ApiError";

/**
 * Service to manage vector storage (ChromaDB) and document chunking.
 */
export class VectorService {
	private client: ChromaClient;
	private embeddings: OpenAIEmbeddings;

	constructor() {
		const host = process.env.CHROMA_HOST || "localhost";
		const port = process.env.CHROMA_PORT || "8000";
		
		this.client = new ChromaClient({
			host: `http://${host}`,
			port: parseInt(port)
		});

		this.embeddings = new OpenAIEmbeddings({
			openAIApiKey: process.env.OPENAI_API_KEY,
			modelName: "text-embedding-3-small"
		});
	}

	/**
	 * Splits raw text into smaller semantic chunks for better retrieval.
	 */
	async splitText(text: string, metadata: Record<string, any> = {}): Promise<{ pageContent: string; metadata: any }[]> {
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 200,
		});

		const docs = await splitter.createDocuments([text], [metadata]);
		return docs.map((d: any) => ({
			pageContent: d.pageContent,
			metadata: d.metadata
		}));
	}

	/**
	 * Creates a new collection or gets an existing one.
	 */
	async getOrCreateCollection(collectionName: string): Promise<Collection> {
		try {
			// Note: Collection names must be 3-63 characters, start/end with alphanumeric, 
			// and can contain underscores or hyphens.
			return await this.client.getOrCreateCollection({
				name: collectionName,
				metadata: { "description": "Document knowledge base" }
			});
		} catch (error: any) {
			console.error("ChromaDB Error:", error);
			throw new ApiError(500, "VECTOR_DB_ERROR", `Failed to get or create collection: ${error.message}`);
		}
	}

	/**
	 * Adds document chunks to the vector store.
	 */
	async addDocuments(collectionName: string, chunks: { pageContent: string; metadata: any }[]) {
		const collection = await this.getOrCreateCollection(collectionName);

		const ids = chunks.map((_, i) => `${collectionName}-chunk-${i}`);
		const documents = chunks.map(c => c.pageContent);
		const metadatas = chunks.map(c => c.metadata);

		// Generate embeddings manually via LangChain and pass them to Chroma.
		const embeddings = await this.embeddings.embedDocuments(documents);

		await collection.add({
			ids,
			embeddings,
			metadatas,
			documents
		});
	}

	/**
	 * Deletes a collection from ChromaDB.
	 */
	async deleteCollection(collectionName: string) {
		try {
			await this.client.deleteCollection({ name: collectionName });
		} catch (error: any) {
			console.warn(`Could not delete collection ${collectionName}, maybe it doesn't exist?`, error.message);
		}
	}
}

// Export singleton instance
export const vectorService = new VectorService();
