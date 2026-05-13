import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { documentService } from "@/services/document.service";
import { flashcardService } from "@/services/flashcard.service";
import { testService } from "@/services/test.service";

export const queryKeys = {
	analytics: ["analytics"] as const,
	documents: {
		all: ["documents"] as const,
		list: () => ["documents", "list"] as const,
		detail: (id: string) => ["documents", "detail", id] as const,
	},
	flashcards: {
		all: ["flashcards"] as const,
		list: () => ["flashcards", "list"] as const,
		stats: () => ["flashcards", "stats"] as const,
	},
	tests: {
		all: ["tests"] as const,
		list: () => ["tests", "list"] as const,
		detail: (id: string) => ["tests", "detail", id] as const,
		attempts: (id: string) => ["tests", "attempts", id] as const,
	},
};

const invalidateStudyData = (
	queryClient: ReturnType<typeof useQueryClient>,
) => {
	void queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
};

export const formatDocument = (doc: any) => ({
	...doc,
	size: doc.fileSizeBytes
		? `${(doc.fileSizeBytes / 1024 / 1024).toFixed(1)} MB`
		: "Unknown",
	status: doc.processed
		? "processed"
		: doc.processingError
			? "error"
			: "analyzing",
	uploadedAt: new Date(doc.createdAt).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}),
	progress: doc.processed ? 100 : 50,
});

export const formatDocumentCard = (doc: any) => ({
	id: doc.id,
	title: doc.title,
	size: doc.fileSizeBytes
		? `${(doc.fileSizeBytes / 1024 / 1024).toFixed(1)}MB`
		: "Unknown",
	pages: null,
	status: doc.processed
		? "processed"
		: doc.processingError
			? "error"
			: "analyzing",
	uploadedAt: new Date(doc.createdAt).toLocaleDateString(),
	type: doc.title.split(".").pop() || "doc",
	progress: doc.processed ? 100 : 50,
});

export const formatTestCard = (test: any) => ({
	id: test.id,
	title: test.title || test.topic || "Untitled Test",
	documentName: test.document?.title || "Manual Topic",
	questionsCount: test.questionsCount || 0,
	difficulty: (test.difficulty || "medium") as "easy" | "medium" | "hard",
	status: (test.testAttempts?.length > 0 ? "completed" : "new") as
		| "completed"
		| "new"
		| "in-progress",
	score: test.testAttempts?.[0]?.score,
	lastAttempt: test.testAttempts?.[0]
		? new Date(test.testAttempts[0].completedAt).toLocaleDateString()
		: undefined,
});

export const groupFlashcardSets = (cards: any[]) => {
	const grouped: Record<string, any> = {};

	cards.forEach((card) => {
		const docId = card.documentId || "standalone";
		if (!grouped[docId]) {
			grouped[docId] = {
				id: docId,
				title: card.document?.title || "Standalone Deck",
				documentName: card.document?.title || "Manual added",
				cardsCount: 0,
				mastery: 0,
				status: "new",
				dueForReview: 0,
				masteredCount: 0,
				learningCount: 0,
			};
		}

		grouped[docId].cardsCount++;

		const isMastered =
			Number(card.easeFactor) >= 2.5 && card.repetitions >= 3;
		if (isMastered) {
			grouped[docId].masteredCount++;
		} else if (card.repetitions > 0) {
			grouped[docId].learningCount++;
		}

		if (card.nextReview && new Date(card.nextReview) < new Date()) {
			grouped[docId].dueForReview++;
		}
	});

	return Object.values(grouped).map((set) => {
		const mastery = Math.round((set.masteredCount / set.cardsCount) * 100);
		let status = "new";
		if (mastery >= 80) status = "mastered";
		else if (set.learningCount > 0 || set.masteredCount > 0)
			status = "learning";

		return { ...set, mastery, status };
	});
};

export const useDocumentsQuery = (enabled = true) =>
	useQuery({
		queryKey: queryKeys.documents.list(),
		queryFn: documentService.getDocuments,
		enabled,
	});

export const useDocumentQuery = (id?: string) =>
	useQuery({
		queryKey: queryKeys.documents.detail(id ?? ""),
		queryFn: () => documentService.getDocumentById(id!),
		enabled: Boolean(id),
	});

export const useTestsQuery = (enabled = true) =>
	useQuery({
		queryKey: queryKeys.tests.list(),
		queryFn: testService.getTests,
		enabled,
	});

export const useTestQuery = (id?: string) =>
	useQuery({
		queryKey: queryKeys.tests.detail(id ?? ""),
		queryFn: () => testService.getTestById(id!),
		enabled: Boolean(id),
	});

export const useFlashcardsQuery = (enabled = true) =>
	useQuery({
		queryKey: queryKeys.flashcards.list(),
		queryFn: flashcardService.getFlashcards,
		enabled,
	});

export const useAnalyticsQuery = () =>
	useQuery({
		queryKey: queryKeys.analytics,
		queryFn: async () => {
			const response = await api.get("/analytics");
			return response.data;
		},
	});

export const useUploadDocumentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: documentService.uploadDocument,
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.documents.all,
			});
			invalidateStudyData(queryClient);
		},
	});
};

export const useDeleteDocumentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: documentService.deleteDocument,
		onSuccess: (_data, id) => {
			void queryClient.removeQueries({
				queryKey: queryKeys.documents.detail(id),
			});
			void queryClient.invalidateQueries({
				queryKey: queryKeys.documents.all,
			});
			void queryClient.invalidateQueries({
				queryKey: queryKeys.tests.all,
			});
			void queryClient.invalidateQueries({
				queryKey: queryKeys.flashcards.all,
			});
			invalidateStudyData(queryClient);
		},
	});
};

export const useRegenerateSummaryMutation = (id?: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => documentService.regenerateSummary(id!),
		onSuccess: () => {
			if (id) {
				void queryClient.invalidateQueries({
					queryKey: queryKeys.documents.detail(id),
				});
			}
			void queryClient.invalidateQueries({
				queryKey: queryKeys.documents.all,
			});
		},
	});
};

export const useGenerateTestMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: testService.generateTest,
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.tests.all,
			});
			invalidateStudyData(queryClient);
		},
	});
};

export const useDeleteTestMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: testService.deleteTest,
		onSuccess: (_data, id) => {
			void queryClient.removeQueries({
				queryKey: queryKeys.tests.detail(id),
			});
			void queryClient.invalidateQueries({
				queryKey: queryKeys.tests.all,
			});
			invalidateStudyData(queryClient);
		},
	});
};

export const useSubmitTestAttemptMutation = (id?: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			answers: Record<string, any>;
			timeSpentSeconds?: number;
		}) =>
			testService.submitAttempt(id!, data.answers, data.timeSpentSeconds),
		onSuccess: () => {
			if (id) {
				void queryClient.invalidateQueries({
					queryKey: queryKeys.tests.detail(id),
				});
				void queryClient.invalidateQueries({
					queryKey: queryKeys.tests.attempts(id),
				});
			}
			void queryClient.invalidateQueries({
				queryKey: queryKeys.tests.all,
			});
			invalidateStudyData(queryClient);
		},
	});
};

export const useGenerateFlashcardsMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: flashcardService.generateFlashcards,
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.flashcards.all,
			});
			invalidateStudyData(queryClient);
		},
	});
};

export const useReviewFlashcardMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, quality }: { id: string; quality: number }) =>
			flashcardService.reviewFlashcard(id, quality),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.flashcards.all,
			});
			invalidateStudyData(queryClient);
		},
	});
};

export const useDeleteFlashcardSetMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: flashcardService.deleteFlashcardSet,
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.flashcards.all,
			});
			invalidateStudyData(queryClient);
		},
	});
};
