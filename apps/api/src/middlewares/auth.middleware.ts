import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "AUTH_REQUIRED", "Authentication required"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload as any;
    next();
  } catch (error) {
    next(new ApiError(401, "AUTH_INVALID_TOKEN", "Invalid or expired access token"));
  }
};
