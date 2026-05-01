import { z } from "zod";
import { registerSchema, loginSchema, updateProfileSchema, googleLoginSchema } from "../schemas/auth.schema";

export type RegisterPayload = z.infer<typeof registerSchema>["body"];
export type LoginPayload = z.infer<typeof loginSchema>["body"];
export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>["body"];
export type GoogleLoginPayload = z.infer<typeof googleLoginSchema>["body"];
