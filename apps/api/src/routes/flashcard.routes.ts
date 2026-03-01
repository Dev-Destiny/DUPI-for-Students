import { Router } from "express";
import * as flashcardController from "../controllers/flashcard.controller";
import { authenticate } from "../middlewares/auth.middleware";

const flashcardRouter = Router();

flashcardRouter.use(authenticate);

flashcardRouter.post("/generate", flashcardController.generate);
flashcardRouter.get("/", flashcardController.list);
flashcardRouter.get("/due", flashcardController.due);
flashcardRouter.post("/", flashcardController.create);
flashcardRouter.put("/:id", flashcardController.update);
flashcardRouter.delete("/:id", flashcardController.remove);
flashcardRouter.post("/:id/review", flashcardController.review);
flashcardRouter.get("/stats", flashcardController.stats);

export default flashcardRouter;
