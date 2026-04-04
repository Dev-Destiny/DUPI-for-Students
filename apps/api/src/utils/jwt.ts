import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AccessTokenPayload, RefreshTokenPayload } from "src/types/auth.types";

const ACCESS_TOKEN_SECRET = env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = env.JWT_REFRESH_SECRET;

export const generateAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
};
