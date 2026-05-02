import z from "zod";
import { registerSchema, loginSchema, updateProfileSchema, googleLoginSchema, accessTokenSchema, refreshTokenSchema } from "../schemas/auth.schema.js";

export type RegisterPayload = z.infer<typeof registerSchema>["body"];
export type LoginPayload = z.infer<typeof loginSchema>["body"];
export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>["body"];
export type GoogleLoginPayload = z.infer<typeof googleLoginSchema>["body"];

export interface AccessTokenPayload {
	userId: string;
	email: string;
}

export interface RefreshTokenPayload {
	userId: string;
	sessionId?: string;
}