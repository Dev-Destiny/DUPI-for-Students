import { z } from "zod";

export const flashcardIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid flashcard ID"),
  }),
});

export const createFlashcardSchema = z.object({
  body: z.object({
    documentId: z.string().uuid("Invalid document ID").optional(),
    front: z.string().min(1, "Front is required"),
    back: z.string().min(1, "Back is required"),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateFlashcardSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid flashcard ID"),
  }),
  body: z.object({
    front: z.string().min(1, "Front is required").optional(),
    back: z.string().min(1, "Back is required").optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const reviewFlashcardSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid flashcard ID"),
  }),
  body: z.object({
    quality: z.number().int().min(0).max(5),
  }),
});

export const generateFlashcardsSchema = z.object({
  body: z.object({
    documentId: z.string().uuid("Invalid document ID"),
    count: z.number().int().min(1).max(50).optional(),
  }),
});
