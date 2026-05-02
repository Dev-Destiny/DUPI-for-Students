import { supabaseAdmin } from "../utils/supabase.js";
import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto";
import { connection as redis } from "../utils/redis.js";
import axios from "axios";
import { env } from "../config/env.js";

/**
 * Uploads a document to Supabase and creates a Prisma record.
 */
export const uploadAndCreateDocument = async (file: Express.Multer.File, userId: string) => {
	const { originalname, mimetype, size, buffer } = file;

	// Generate a secure unique filename
	const fileExtension = originalname.split(".").pop() || "";
	const safeFilename = `${userId}/${crypto.randomUUID()}.${fileExtension}`;
	const bucketName = process.env.SUPABASE_BUCKET_NAME || "documents";

	// Upload to Supabase Storage
	const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
		.from(bucketName)
		.upload(safeFilename, buffer, {
			contentType: mimetype,
			upsert: false,
		});

	if (uploadError) {
		console.error("Supabase Upload Error:", uploadError);
		throw new ApiError(
			500,
			"STORAGE_ERROR",
			"Failed to upload file to cloud storage.",
		);
	}

	// Retrieve public URL
	const { data: publicUrlData } = supabaseAdmin.storage
		.from(bucketName)
		.getPublicUrl(uploadData.path);

	const fileUrl = publicUrlData.publicUrl;

	// Create record in Prisma Document table
	const newDocument = await prisma.document.create({
		data: {
			userId,
			title: originalname,
			fileUrl,
			storagePath: uploadData.path,
			fileType: mimetype,
			fileSizeBytes: size,
			processed: false,
		},
	});

	// Dispatch background task to Python Processor via Redis List
	await redis.lpush("studify_jobs", JSON.stringify({
		documentId: newDocument.id,
		userId
	}));

	return newDocument;
};


export const getDocumentsByUser = async (userId: string) => {
	return await prisma.document.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
	});
};


export const getDocumentById = async (id: string, userId: string) => {
	const document = await prisma.document.findFirst({
		where: { id, userId },
	});

	if (!document) {
		throw new ApiError(404, "NOT_FOUND", "Document not found or access denied.");
	}

	return document;
};

/**
 * Deletes a document from Database, Supabase Storage, and Chroma Vector DB.
 * Chained to prevent orphaned assets.
 */
export const deleteDocument = async (id: string, userId: string) => {
	const document = await getDocumentById(id, userId);

	// 2. Chained Operations
	
	// A. Delete associated Flashcards and Tests (Manual cascade since schema missing it)
	// We handle this first to clear dependent records in Postgres
	await prisma.flashcard.deleteMany({ where: { documentId: id } });
	await prisma.test.deleteMany({ where: { documentId: id } });

	// B. Delete from Vector Store (Chroma)
	if (document.chromaCollectionId) {
		try {
			await axios.delete(`${env.AI_PROCESSOR_URL}/vector-store/${document.chromaCollectionId}`);
		} catch (error) {
			console.error("Vector Store Deletion Error (non-blocking):", error);
		}
	}

	// C. Delete from Supabase Storage
	try {
		const bucketName = process.env.SUPABASE_BUCKET_NAME || "documents";
		const storagePath = document.storagePath;
		
		if (storagePath) {
			await supabaseAdmin.storage.from(bucketName).remove([storagePath]);
		} else {
			// Fallback for older records
			const urlParts = document.fileUrl.split(`/public/${bucketName}/`);
			const path = urlParts[1];
			if (path) {
				await supabaseAdmin.storage.from(bucketName).remove([path]);
			}
		}
	} catch (error) {
		console.error("Supabase Deletion Error (non-blocking):", error);
	}

	// D. Final deletion from Prisma (The source of truth)
	return await prisma.document.delete({
		where: { id },
	});
};

/**
 * Downloads a document buffer from Supabase storage.
 */
export const getDocumentBuffer = async (documentId: string, userId: string) => {
	const document = await getDocumentById(documentId, userId);
	const bucketName = process.env.SUPABASE_BUCKET_NAME || "documents";
	let storagePath = document.storagePath;

	if (!storagePath) {
		// Fallback for older records
		const urlParts = document.fileUrl.split(`/public/${bucketName}/`);
		storagePath = urlParts[1];
	}

	if (!storagePath) {
		throw new ApiError(500, "STORAGE_ERROR", "Could not resolve storage path from URL.");
	}

	const { data, error } = await supabaseAdmin.storage
		.from(bucketName)
		.download(storagePath);

	if (error) {
		console.error("Supabase Download Error:", error);
		throw new ApiError(500, "STORAGE_ERROR", "Failed to download file from cloud storage.");
	}

	return Buffer.from(await data.arrayBuffer());
};
