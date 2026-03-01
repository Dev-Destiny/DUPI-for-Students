import { Router } from "express";
import * as testController from "../controllers/test.controller";
import { authenticate } from "../middlewares/auth.middleware";

const testRouter = Router();

// Public routes
testRouter.get("/shared/:token", testController.getShared);

// Protected routes (apply authenticate after public routes)
testRouter.post("/generate", authenticate, testController.generate);
testRouter.get("/", authenticate, testController.list);
testRouter.get("/:id", authenticate, testController.get);
testRouter.put("/:id", authenticate, testController.update);
testRouter.delete("/:id", authenticate, testController.remove);
testRouter.post("/:id/attempt", authenticate, testController.attempt);
testRouter.get("/:id/attempts", authenticate, testController.attempts);
testRouter.post("/:id/share", authenticate, testController.share);
testRouter.delete("/:id/share", authenticate, testController.revokeShare);

export default testRouter;
