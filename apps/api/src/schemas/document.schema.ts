import { z } from "zod";

export const documentIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid document ID"),
  }),
});

// Since upload is handled by multer, we might not need a Zod schema for the body, 
// but we could validate additional fields if any.
