import { Request, Response, NextFunction } from "express";

export const upload = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Document upload endpoint stub" });
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Document list endpoint stub" });
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Document detail endpoint stub" });
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Document delete endpoint stub" });
};

export const status = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Document status endpoint stub" });
};
