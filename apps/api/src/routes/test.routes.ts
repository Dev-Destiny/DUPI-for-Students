import { Router } from "express";
import * as testController from "../controllers/test.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";  
import { 
  generateTestSchema, 
  shareTestSchema, 
  sharedTokenSchema, 
  testAttemptSchema, 
  testIdSchema, 
  updateTestSchema 
} from "../schemas/test.schema.js";

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
