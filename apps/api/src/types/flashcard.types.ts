import { z } from "zod";
import { 
  flashcardIdSchema, 
  createFlashcardSchema, 
  updateFlashcardSchema, 
  reviewFlashcardSchema,
  generateFlashcardsSchema
} from "../schemas/flashcard.schema.js";

export type FlashcardIdParams = z.infer<typeof flashcardIdSchema>["params"];
export type CreateFlashcardPayload = z.infer<typeof createFlashcardSchema>["body"];
export type UpdateFlashcardPayload = z.infer<typeof updateFlashcardSchema>["body"];
export type ReviewFlashcardPayload = z.infer<typeof reviewFlashcardSchema>["body"];
export type GenerateFlashcardsPayload = z.infer<typeof generateFlashcardsSchema>["body"];
