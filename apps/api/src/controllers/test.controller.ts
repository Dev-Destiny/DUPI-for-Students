import { Request, Response, NextFunction } from "express";
import * as testService from "../services/test.service";
import { ApiError } from "../utils/ApiError";

export const generate = async (req: Request, res: Response, next: NextFunction) => {
  // Logic here should involve AI generation, which is likely another service.
  // For now, let's keep it as a stub or implement a simple mock if needed.
  res.json({ message: "Test generation endpoint stub — needs AI service integration." });
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new ApiError(401, "AUTH_REQUIRED", "Login required.");
    const tests = await testService.getTestsByUser(userId);
    res.json(tests);
  } catch (error) {
    next(error);
  }
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id as string;
    if (!userId) throw new ApiError(401, "AUTH_REQUIRED", "Login required.");
    const test = await testService.getTestById(id, userId);
    res.json(test);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  // Can implement based on updateTestSchema
  res.json({ message: "Test update endpoint stub" });
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id as string;
    if (!userId) throw new ApiError(401, "AUTH_REQUIRED", "Login required.");
    const result = await testService.deleteTest(id, userId);
    res.json({ message: "Test deleted successfully", result });
  } catch (error) {
    next(error);
  }
};

export const attempt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id as string;
    if (!userId) throw new ApiError(401, "AUTH_REQUIRED", "Login required.");
    const attempt = await testService.createAttempt(id, userId, req.body);
    res.json(attempt);
  } catch (error) {
    next(error);
  }
};

export const attempts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id as string;
    if (!userId) throw new ApiError(401, "AUTH_REQUIRED", "Login required.");
    const test = await testService.getTestById(id, userId);
    res.json(test.testAttempts);
  } catch (error) {
    next(error);
  }
};

export const getShared = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Public shared test endpoint stub" });
};

export const share = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Generate share link endpoint stub" });
};

export const revokeShare = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Revoke share link endpoint stub" });
};
