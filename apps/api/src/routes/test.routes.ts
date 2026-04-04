import { Router } from "express";
import * as testController from "../controllers/test.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { 
  generateTestSchema, 
  shareTestSchema, 
  sharedTokenSchema, 
  testAttemptSchema, 
  testIdSchema, 
  updateTestSchema 
} from "../schemas/test.schema";

const testRouter = Router();

// Public routes
testRouter.get("/shared/:token", validate(sharedTokenSchema), testController.getShared);

// Protected routes (apply authenticate after public routes)
testRouter.post("/generate", authenticate, validate(generateTestSchema), testController.generate);
testRouter.get("/", authenticate, testController.list);
testRouter.get("/:id", authenticate, validate(testIdSchema), testController.get);
testRouter.put("/:id", authenticate, validate(updateTestSchema), testController.update);
testRouter.delete("/:id", authenticate, validate(testIdSchema), testController.remove);
testRouter.post("/:id/attempt", authenticate, validate(testAttemptSchema), testController.attempt);
testRouter.get("/:id/attempts", authenticate, validate(testIdSchema), testController.attempts);
testRouter.post("/:id/share", authenticate, validate(shareTestSchema), testController.share);
testRouter.delete("/:id/share", authenticate, validate(testIdSchema), testController.revokeShare);

export default testRouter;
