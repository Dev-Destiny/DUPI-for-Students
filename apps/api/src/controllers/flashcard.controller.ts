import { Request, Response, NextFunction, RequestHandler } from "express";
import * as flashcardService from "../services/flashcard.service";
import { ApiError } from "../utils/ApiError";

export const generate = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Flashcard generation endpoint stub — needs AI service integration." });
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new ApiError(401, "AUTH_REQUIRED", "Login required.");
    const flashcards = await flashcardService.getFlashcardsByUser(userId);
    res.json(flashcards);
  } catch (error) {
    next(error);
  }
};

export const due = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new ApiError(401, "AUTH_REQUIRED", "Login required.");
    const flashcards = await flashcardService.getFlashcardsDue(userId);
    res.json(flashcards);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new ApiError(401, "AUTH_REQUIRED", "Login required.");
    const flashcard = await flashcardService.createFlashcard(userId, req.body);
    res.status(201).json(flashcard);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id as string;
    if (!userId) throw new ApiError(401, "AUTH_REQUIRED", "Login required.");
    const flashcard = await flashcardService.updateFlashcard(id, userId, req.body);
    res.json(flashcard);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id as string;
    if (!userId) throw new ApiError(401, "AUTH_REQUIRED", "Login required.");
    const result = await flashcardService.deleteFlashcard(id, userId);
    res.json({ message: "Flashcard deleted successfully", result });
  } catch (error) {
    next(error);
  }
};

export const review: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { quality } = req.body; // 0-5 scale

    if (!userId) throw new ApiError(401, "AUTH_REQUIRED", "Login required.");
    
    // In a real implementation we would delegate to a FlashcardService.submitReview
    // But for MVP, we'll keep it here or call a service. Let's create a service method.
    const result = await flashcardService.recordReview(id as string, userId, Number(quality));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const stats = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Flashcard statistics endpoint stub" });
};
