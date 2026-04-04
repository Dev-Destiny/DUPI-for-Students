import { Router } from "express";
import * as flashcardController from "../controllers/flashcard.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { 
  createFlashcardSchema, 
  flashcardIdSchema, 
  generateFlashcardsSchema, 
  reviewFlashcardSchema, 
  updateFlashcardSchema 
} from "../schemas/flashcard.schema";

const flashcardRouter = Router();

flashcardRouter.use(authenticate);

flashcardRouter.post("/generate", validate(generateFlashcardsSchema), flashcardController.generate);
flashcardRouter.get("/", flashcardController.list);
flashcardRouter.get("/due", flashcardController.due);
flashcardRouter.post("/", validate(createFlashcardSchema), flashcardController.create);
flashcardRouter.put("/:id", validate(updateFlashcardSchema), flashcardController.update);
flashcardRouter.delete("/:id", validate(flashcardIdSchema), flashcardController.remove);
flashcardRouter.post("/:id/review", validate(reviewFlashcardSchema), flashcardController.review);
flashcardRouter.get("/stats", flashcardController.stats);

export default flashcardRouter;
