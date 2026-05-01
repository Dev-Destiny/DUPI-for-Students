import { z } from "zod";
import { 
  testIdSchema, 
  generateTestSchema, 
  updateTestSchema, 
  testAttemptSchema, 
  shareTestSchema,
  sharedTokenSchema
} from "../schemas/test.schema";

export type TestIdParams = z.infer<typeof testIdSchema>["params"];
export type GenerateTestPayload = z.infer<typeof generateTestSchema>["body"];
export type UpdateTestPayload = z.infer<typeof updateTestSchema>["body"];
export type TestAttemptPayload = z.infer<typeof testAttemptSchema>["body"];
export type ShareTestPayload = z.infer<typeof shareTestSchema>["body"];
export type SharedTokenParams = z.infer<typeof sharedTokenSchema>["params"];

// Internal question format (JSON in DB)
export interface QuestionOption {
  label: string;
  text: string;
}

export interface Question {
  id: string; // usually a UUID or string index
  question: string;
  type: "mcq" | "short_answer";
  options?: QuestionOption[];
  answer: string; // The correct label (A, B, C, D) or sample answer
  explanation?: string;
}
