import { z } from "zod";
import { documentIdSchema } from "../schemas/document.schema";

export type DocumentIdParams = z.infer<typeof documentIdSchema>["params"];
// Upload payload is mostly handled by Multer (File object)
