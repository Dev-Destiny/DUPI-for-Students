import { z } from "zod";

export const testIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid test ID"),
  }),
});

export const sharedTokenSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Token is required"),
  }),
});

export const generateTestSchema = z.object({
  body: z.object({
    documentId: z.string().uuid("Invalid document ID").optional(),
    topic: z.string().optional(),
    count: z.number().int().min(1).max(20).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  }),
});

export const updateTestSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid test ID"),
  }),
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    topic: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    isPublic: z.boolean().optional(),
  }),
});

export const testAttemptSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid test ID"),
  }),
  body: z.object({
    answers: z.record(z.any()), // Map of question ID to answer
    timeSpentSeconds: z.number().int().min(0).optional(),
  }),
});

export const shareTestSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid test ID"),
  }),
  body: z.object({
    isPublic: z.boolean().optional(),
  }),
});
