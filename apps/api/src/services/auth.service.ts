import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import * as jwtUtils from "../utils/jwt";
import {
	LoginUserPayload,
	RegisterUserPayload,
	UpdateUserPayload,
} from "src/types/auth.types";

export const registerUser = async (data: RegisterUserPayload) => {
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
		data: { tokenId: refreshToken },
	});

	const { passwordHash: _, ...userWithoutPassword } = user;
	return { user: userWithoutPassword, accessToken, refreshToken };
};

export const loginUser = async (data: LoginUserPayload) => {
	const { email, password } = data;

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new ApiError(
			401,
			"AUTH_INVALID_CREDENTIALS",
			"Invalid email or password",
		);
	}

	const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
	if (!isPasswordValid) {
		throw new ApiError(
			401,
			"AUTH_INVALID_CREDENTIALS",
			"Invalid email or password",
		);
	}

	const accessToken = jwtUtils.generateAccessToken({
		userId: user.id,
		email: user.email,
	});
	const refreshToken = jwtUtils.generateRefreshToken({ userId: user.id });

	// Update tokenId for session tracking
	await prisma.user.update({
		where: { id: user.id },
		data: { tokenId: refreshToken },
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

export const updateUser = async (userId: string, data: UpdateUserPayload) => {
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
