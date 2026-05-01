import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import * as jwtUtils from "../utils/jwt";
import {
	LoginPayload,
	RegisterPayload,
	UpdateProfilePayload,
	GoogleLoginPayload,	
} from "../types";

const googleClient = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
);

export const registerUser = async (data: RegisterPayload) => {
	const { email, password, displayName } = data;

	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		throw new ApiError(400, "AUTH_EMAIL_EXISTS", "Email already in use");
	}

	const passwordHash = await bcrypt.hash(password, 12);

	const user = await prisma.user.create({
		data: {
			email,
			passwordHash,
			displayName,
		},
	});

	const accessToken = jwtUtils.generateAccessToken({
		userId: user.id,
		email: user.email,
	});
	const refreshToken = jwtUtils.generateRefreshToken({ userId: user.id });

	// Store refreshToken as tokenId for session tracking/revocation
	await prisma.user.update({
		where: { id: user.id },
		data: { tokenId: refreshToken, lastLoginAt: new Date() },
	});

	const { passwordHash: _, ...userWithoutPassword } = user;
	return { user: userWithoutPassword, accessToken, refreshToken };
};

export const loginUser = async (data: LoginPayload) => {
	const { email, password } = data;

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new ApiError(
			401,
			"AUTH_INVALID_CREDENTIALS",
			"Invalid email or password",
		);
	}

	if (user.passwordHash) {
		const isPasswordValid = await bcrypt.compare(
			password,
			user.passwordHash,
		);
		if (!isPasswordValid) {
			throw new ApiError(
				401,
				"AUTH_INVALID_CREDENTIALS",
				"Invalid email or password",
			);
		}
	}

	const accessToken = jwtUtils.generateAccessToken({
		userId: user.id,
		email: user.email,
	});
	const refreshToken = jwtUtils.generateRefreshToken({ userId: user.id });

	// Update tokenId for session tracking
	await prisma.user.update({
		where: { id: user.id },
		data: { tokenId: refreshToken, lastLoginAt: new Date() },
	});

	const { passwordHash: _, ...userWithoutPassword } = user;
	return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
	try {
		const payload: any = jwtUtils.verifyRefreshToken(refreshToken);
		const user = await prisma.user.findUnique({
			where: { id: payload.userId },
		});

		if (!user) {
			throw new ApiError(401, "AUTH_USER_NOT_FOUND", "User not found");
		}

		const accessToken = jwtUtils.generateAccessToken({
			userId: user.id,
			email: user.email,
		});
		const newRefreshToken = jwtUtils.generateRefreshToken({
			userId: user.id,
		});

		// Rotate token in DB
		await prisma.user.update({
			where: { id: user.id },
			data: { tokenId: newRefreshToken },
		});

		return { accessToken, refreshToken: newRefreshToken };
	} catch (error) {
		throw new ApiError(
			401,
			"AUTH_INVALID_REFRESH_TOKEN",
			"Invalid refresh token",
		);
	}
};

export const getUserProfile = async (userId: string) => {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) {
		throw new ApiError(404, "AUTH_USER_NOT_FOUND", "User not found");
	}

	const { passwordHash: _, ...userWithoutPassword } = user;
	return userWithoutPassword;
};

export const updateUser = async (
	userId: string,
	data: UpdateProfilePayload,
) => {
	try {
		console.log(
			`[DEBUG] authService.updateUser: updating user ${userId} with data:`,
			data,
		);
		const user = await prisma.user.update({
			where: { id: userId },
			data: {
				displayName: data.displayName,
				isOnboarded: data.isOnboarded,
				studyField: data.studyField,
				profileImageUrl: data.profileImageUrl,
			},
		});

		console.log(`[DEBUG] authService.updateUser: result from DB:`, user);
		const { passwordHash: _, ...userWithoutPassword } = user;
		return userWithoutPassword;
	} catch (error) {
		throw new ApiError(400, "AUTH_USER_NOT_FOUND", "User not found");
	}
};

export const googleLogin = async (data: GoogleLoginPayload) => {
	const { code } = data;

	try {
		// Exchange code for tokens
		const { tokens } = await googleClient.getToken({
			code,
			redirect_uri: "postmessage", // Specialized for frontend code exchange
		});

		googleClient.setCredentials(tokens);

		const ticket = await googleClient.verifyIdToken({
			idToken: tokens.id_token!,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		if (!payload || !payload.email) {
			throw new ApiError(
				400,
				"AUTH_INVALID_GOOGLE_TOKEN",
				"Invalid Google token or email not provided",
			);
		}

		const {
			email,
			sub: googleId,
			name: displayName,
			picture: profileImageUrl,
		} = payload;

		let user = await prisma.user.findFirst({
			where: {
				OR: [{ googleId }, { email }],
			},
		});

		if (!user) {
			// Create new user if doesn't exist
			user = await prisma.user.create({
				data: {
					email,
					googleId,
					displayName: displayName || email.split("@")[0],
					profileImageUrl,
					emailVerified: payload.email_verified || false,
				},
			});
		} else if (!user.googleId) {
			// Link existing email account to Google ID
			user = await prisma.user.update({
				where: { id: user.id },
				data: {
					googleId,
					profileImageUrl: user.profileImageUrl || profileImageUrl,
				},
			});
		}

		const accessToken = jwtUtils.generateAccessToken({
			userId: user.id,
			email: user.email,
		});
		const refreshToken = jwtUtils.generateRefreshToken({ userId: user.id });

		// Update tokenId for session tracking
		await prisma.user.update({
			where: { id: user.id },
			data: { tokenId: refreshToken, lastLoginAt: new Date() },
		});

		const { passwordHash: _, ...userWithoutPassword } = user;
		return { user: userWithoutPassword, accessToken, refreshToken };
		
	} catch (error: any) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(
			401,
			"AUTH_GOOGLE_FAILED",
			`Google authentication failed: ${error.message}`,
		);
	}
};

export const changePassword = async (userId: string, data: any) => {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw new ApiError(404, "AUTH_USER_NOT_FOUND", "User not found");

	if (user.passwordHash) {
		const isMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
		if (!isMatch) throw new ApiError(400, "AUTH_INVALID_PASSWORD", "Incorrect current password");
	}

	const passwordHash = await bcrypt.hash(data.newPassword, 10);
	await prisma.user.update({
		where: { id: userId },
		data: { passwordHash },
	});

	return { message: "Password updated successfully" };
};

export const updateUserSettings = async (userId: string, data: any) => {
	try {
		const user = await prisma.user.update({
			where: { id: userId },
			data: {
				preferences: data.preferences as any,
				notifications: data.notifications as any,
			},
		});

		const { passwordHash: _, ...userWithoutPassword } = user;
		return userWithoutPassword;
	} catch (error) {
		throw new ApiError(400, "AUTH_USER_NOT_FOUND", "User not found");
	}
};
