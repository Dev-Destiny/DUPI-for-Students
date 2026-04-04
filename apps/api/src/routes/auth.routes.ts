import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema, updateProfileSchema } from "../schemas/auth.schema";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/refresh", authController.refresh);
authRouter.get("/me", authenticate, authController.me);
authRouter.put("/update-profile", authenticate, validate(updateProfileSchema), authController.updateProfile);
authRouter.post("/verify-email", authController.verifyEmail);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
