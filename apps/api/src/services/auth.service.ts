import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import * as jwtUtils from "../utils/jwt";

export const registerUser = async (data: any) => {
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

  const accessToken = jwtUtils.generateAccessToken({ userId: user.id, email: user.email });
  const refreshToken = jwtUtils.generateRefreshToken({ userId: user.id });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "AUTH_INVALID_CREDENTIALS", "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, "AUTH_INVALID_CREDENTIALS", "Invalid email or password");
  }

  const accessToken = jwtUtils.generateAccessToken({ userId: user.id, email: user.email });
  const refreshToken = jwtUtils.generateRefreshToken({ userId: user.id });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const payload: any = jwtUtils.verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      throw new ApiError(401, "AUTH_USER_NOT_FOUND", "User not found");
    }

    const accessToken = jwtUtils.generateAccessToken({ userId: user.id, email: user.email });
    return { accessToken };
  } catch (error) {
    throw new ApiError(401, "AUTH_INVALID_REFRESH_TOKEN", "Invalid refresh token");
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

export const updateUser = async (userId: string, data: any) => {
  console.log(`[DEBUG] authService.updateUser: updating user ${userId} with data:`, data);
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
};
