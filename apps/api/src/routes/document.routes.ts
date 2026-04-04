import { Router } from "express";
import * as documentController from "../controllers/document.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";
import { validate } from "../middlewares/validate.middleware";
import { documentIdSchema } from "../schemas/document.schema";

const documentRouter = Router();

documentRouter.use(authenticate);

documentRouter.post("/upload", uploadMiddleware.single("file") as any, documentController.upload);
documentRouter.get("/", documentController.list);
documentRouter.get("/:id", validate(documentIdSchema), documentController.get);
documentRouter.delete("/:id", validate(documentIdSchema), documentController.remove);
documentRouter.get("/:id/status", validate(documentIdSchema), documentController.status);

export default documentRouter;

