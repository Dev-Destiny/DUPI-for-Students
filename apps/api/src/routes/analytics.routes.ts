import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, analyticsController.getAnalytics);

export default router;
