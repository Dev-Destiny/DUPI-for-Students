import axios from "axios";
import { env } from "../config/env";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

export const generateTest = async (
	documentId: string,
	userId: string,
	numQuestions: number = 10,
	difficulty: string = "medium",
	topic: string = "",
	questionType: string = "mcq",
) => {
	const document = await prisma.document.findFirst({
		where: { id: documentId, userId },
	});

	if (!document || !document.processed) {
		throw new ApiError(
			400,
			"DOC_NOT_READY",
			"Document is not processed yet.",
		);
	}

	const collectionId = document.chromaCollectionId;
	if (!collectionId) {
		throw new ApiError(
			400,
			"CHROMA_NOT_FOUND",
			"No vector collection found for this document.",
		);
	}

	// Request generation from Python service
	const response = await axios.post(
		`${env.AI_PROCESSOR_URL}/generate/test`,
		null,
		{
			params: {
				collection_id: collectionId,
				num_questions: numQuestions,
				difficulty: difficulty,
				topic: topic,
				question_type: questionType,
			},
		},
	);

	const generatedData = response.data;

	// Save the new test to Postgres
	return prisma.test.create({
		data: {
			userId,
			documentId,
			title: generatedData.title || `Test: ${document.title}`,
			questions: generatedData.questions,
			questionsCount: generatedData.questions.length,
		},
	});
};

export const generateFlashcards = async (
	documentId: string,
	userId: string,
	numCards: number = 15,
	difficulty: string = "medium",
	topic: string = "",
) => {
	const document = await prisma.document.findFirst({
		where: { id: documentId, userId },
	});

	if (!document || !document.processed) {
		throw new ApiError(
			400,
			"DOC_NOT_READY",
			"Document is not processed yet.",
		);
	}

	const collectionId = document.chromaCollectionId;
	if (!collectionId) {
		throw new ApiError(
			400,
			"CHROMA_NOT_FOUND",
			"No vector collection found for this document.",
		);
	}

	// Request generation from Python service
	const response = await axios.post(
		`${env.AI_PROCESSOR_URL}/generate/flashcards`,
		null,
		{
			params: {
				collection_id: collectionId,
				num_cards: numCards,
				difficulty: difficulty,
				topic: topic,
			},
		},
	);

	const generatedData = response.data;

	// Create individual cards directly
	const cardsData = generatedData.flashcards.map((card: any) => ({
		userId,
		documentId,
		front: card.front,
		back: card.back,
	}));

	return prisma.flashcard.createMany({
		data: cardsData,
	});
};

/**
 * Re-generates a summary for an already-processed document.
 * Uses the document's Chroma collection so we don't need the raw file.
 */
export const generateSummary = async (documentId: string, userId: string) => {
	const document = await prisma.document.findFirst({
		where: { id: documentId, userId },
	});

	if (!document) {
		throw new ApiError(404, "NOT_FOUND", "Document not found.");
	}
	if (!document.processed) {
		throw new ApiError(
			400,
			"DOC_NOT_READY",
			"Document is not processed yet.",
		);
	}
	if (!document.chromaCollectionId) {
		throw new ApiError(
			400,
			"CHROMA_NOT_FOUND",
			"No vector collection found for this document.",
		);
	}

	const response = await axios.post(
		`${env.AI_PROCESSOR_URL}/generate/summary`,
		null,
		{
			params: { collection_id: document.chromaCollectionId },
		},
	);

	const { summary } = response.data;

	// Persist back to Postgres so it's available immediately on next page load
	await prisma.document.update({
		where: { id: documentId },
		data: { summary },
	});

	return { summary };
};
