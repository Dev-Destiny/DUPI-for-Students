import { Router } from "express";
import * as documentController from "../controllers/document.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { documentIdSchema } from "../schemas/document.schema.js";

const documentRouter = Router();

documentRouter.use(authenticate);

documentRouter.post("/upload", uploadMiddleware.single("file") as any, documentController.upload);
documentRouter.get("/", documentController.list);
documentRouter.get("/:id", validate(documentIdSchema), documentController.get);
documentRouter.delete("/:id", validate(documentIdSchema), documentController.remove);
documentRouter.get("/:id/status", validate(documentIdSchema), documentController.status);
documentRouter.post("/:id/regenerate-summary", validate(documentIdSchema), documentController.regenerateSummary);

export default documentRouter;

