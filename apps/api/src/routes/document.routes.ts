import { Router } from "express";
import * as documentController from "../controllers/document.controller";
import { authenticate } from "../middlewares/auth.middleware";

const documentRouter = Router();

documentRouter.use(authenticate);

documentRouter.post("/upload", documentController.upload);
documentRouter.get("/", documentController.list);
documentRouter.get("/:id", documentController.get);
documentRouter.delete("/:id", documentController.remove);
documentRouter.get("/:id/status", documentController.status);

export default documentRouter;
