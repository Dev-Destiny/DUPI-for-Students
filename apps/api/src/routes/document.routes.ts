import { Router } from "express";
import * as documentController from "../controllers/document.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";

const documentRouter = Router();

documentRouter.use(authenticate);

documentRouter.post("/upload", uploadMiddleware.single("file") as any, documentController.upload);
documentRouter.get("/", documentController.list);
documentRouter.get("/:id", documentController.get);
documentRouter.delete("/:id", documentController.remove);
documentRouter.get("/:id/status", documentController.status);

export default documentRouter;

