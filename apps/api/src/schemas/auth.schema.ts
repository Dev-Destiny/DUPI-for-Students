import { z } from "zod";

export const registerSchema = z.object({
	body: z.object({
		email: z.string().email("Invalid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long"),
		displayName: z
			.string()
			.min(2, "Display name must be at least 2 characters long"),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z.string().email("Invalid email address"),
		password: z.string().min(1, "Password is required"),
	}),
});

export const updateProfileSchema = z.object({
	body: z.object({
		displayName: z
			.string()
			.min(2, "Display name must be at least 2 characters long")
			.optional(),
		isOnboarded: z.boolean().optional(),
		studyField: z.string().optional(),
		profileImageUrl: z
			.string()
			.url("Invalid URL")
			.optional()
			.or(z.literal("")),
	}),
});

export type RegisterUserPayload = z.infer<typeof registerSchema>["body"];
export type LoginUserPayload = z.infer<typeof loginSchema>["body"];
export type UpdateUserPayload = z.infer<typeof updateProfileSchema>["body"];

export const googleLoginSchema = z.object({
	body: z.object({
		code: z.string().min(1, "Google authorization code is required"),
	}),
});

// access and refresh token schema
export const accessTokenSchema = z.object({
	body: z.object({
		token: z.string().min(1, "Access token is required"),
    email: z.string().email("Invalid email address"),
	}),
});

export const refreshTokenSchema = z.object({
	body: z.object({
		token: z.string().min(1, "Refresh token is required"),
    email: z.string().email("Invalid email address"),
    userId: z.string().min(1, "User ID is required"),
    sessionId: z.string().min(1, "Session ID is required"),
	}),
});
