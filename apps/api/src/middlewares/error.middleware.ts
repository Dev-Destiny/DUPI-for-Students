import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        timestamp: new Date().toISOString(),
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    error: {
      code: "SERVER_INTERNAL_ERROR",
      message: "An internal server error occurred",
      timestamp: new Date().toISOString(),
    },
  });
};
