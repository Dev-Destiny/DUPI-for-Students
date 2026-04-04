import { Queue, Worker, Job } from "bullmq";
import { connection } from "../utils/redis";
import prisma from "../lib/prisma";
import * as documentService from "../services/document.service";
import { extractionService } from "../services/extraction.service";
import { vectorService } from "../services/vector.service";

const QUEUE_NAME = "document-processing";

/**
 * The BullMQ Queue instance for adding jobs
 */
export const documentQueue = new Queue<{ documentId: string; userId: string }, any, "extract-text">(
	QUEUE_NAME,
	{ connection: connection as any }
);

/**
 * The BullMQ Worker instance for processing jobs asynchronously
 */
export const documentWorker = new Worker(
	QUEUE_NAME,
	async (job: Job) => {
		const { documentId, userId } = job.data;
		console.log(`[Worker] Started processing document: ${documentId} for user: ${userId}`);

		try {
			// 1. Get document metadata
			const document = await prisma.document.findUnique({
				where: { id: documentId }
			});

			if (!document) {
				console.error(`[Worker] Document not found: ${documentId}`);
				return;
			}

			// Update document state to analyzing
			await prisma.document.update({
				where: { id: documentId },
				data: { processed: false, processingError: null }
			});

			// 2. Download file from Supabase
			console.log(`[Worker] Downloading document: ${document.title}`);
			const buffer = await documentService.getDocumentBuffer(documentId, userId);

			// 3. Extract raw text
			console.log(`[Worker] Extracting text from ${document.fileType}...`);
			const extractedText = await extractionService.extractText(buffer, document.fileType);
			
			console.log(`[Worker] Text extracted successfully. Length: ${extractedText.length} characters.`);
			
			// For now, we log the first 200 characters to confirm success
			console.log(`[Worker] Text Preview: "${extractedText.substring(0, 200)}..."`);

			// 4. Chunking & Vectorization
			console.log(`[Worker] Splitting text into chunks...`);
			const chunks = await vectorService.splitText(extractedText, {
				documentId,
				userId,
				title: document.title,
				source: document.fileUrl
			});

			console.log(`[Worker] Created ${chunks.length} chunks. Storing in ChromaDB...`);
			
			// Chroma collection name derived from documentId
			// Must be 3-63 characters, start/end with alphanumeric
			const collectionName = `doc_${documentId.replace(/-/g, '_')}`; 
			
			try {
				await vectorService.addDocuments(collectionName, chunks);
				
				// 5. Update DB upon full success
				await prisma.document.update({
					where: { id: documentId },
					data: { 
						processed: true,
						chromaCollectionId: collectionName,
						chunkCount: chunks.length
					} 
				});
				console.log(`[Worker] Full processing job completed successfully for doc: ${documentId}`);
			} catch (vError: any) {
				console.warn(`[Worker] Vector storage failed: ${vError.message}. Marking partially processed.`);
				// If vector store is not running (ECONNREFUSED), we treat it as an error to retry later
				if (vError.message.includes("ECONNREFUSED") || vError.message.includes("Vector Store")) {
					throw vError; 
				}
				
				// Other errors: allow it to stay partially processed
				await prisma.document.update({
					where: { id: documentId },
					data: { 
						processed: false,
						processingError: "Vector storage failed - check OpenAI API or ChromaDB status."
					} 
				});
			}

			return { success: true };
		} catch (error: any) {
			console.error(`[Worker] Error processing document ${documentId}:`, error);
			
			// Mark document error state
			await prisma.document.update({
				where: { id: documentId },
				data: {
					processingError: error.message || "Unknown error during text extraction"
				}
			});

			throw error;
		}
	},
	{ 
		connection: connection as any,
		lockDuration: 60000,
		lockRenewTime: 20000
	}
);

// Helpful diagnostics for unhandled queue errors
documentWorker.on("completed", (job) => {
	console.log(`[Queue] Job ${job.id} marked as completed!`);
});

documentWorker.on("failed", (job, err) => {
	console.log(`[Queue] Job ${job?.id} failed with error:`, err);
});
