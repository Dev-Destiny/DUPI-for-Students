import { Request, Response, NextFunction } from "express";

export const generate = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Flashcard generation endpoint stub" });
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Flashcard list endpoint stub" });
};

export const due = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Due flashcards endpoint stub" });
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Manual flashcard creation endpoint stub" });
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Flashcard update endpoint stub" });
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Flashcard delete endpoint stub" });
};

export const review = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Flashcard review recording endpoint stub" });
};

export const stats = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Flashcard statistics endpoint stub" });
};
