import { RequestHandler } from "express";
import * as authService from "../services/auth.service";
import { LoginUserPayload, RegisterUserPayload, UpdateUserPayload } from "src/types/auth.types";
import prisma from "src/lib/prisma";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.registerUser(req.body as RegisterUserPayload);
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res , next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(req.body as LoginUserPayload);
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await prisma.user.updateMany({
        where: { tokenId: refreshToken },
        data: { tokenId: null }
      });
    }
  } catch (error) {
    console.error("Logout DB cleanup failed:", error);
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }
    const tokenValid = await prisma.user.findUnique({
      where: {
        tokenId: refreshToken
      },
    });

    if (!tokenValid) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user!.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const user = await authService.updateUser(req.user!.userId, req.body as UpdateUserPayload);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail: RequestHandler = async (req, res, next) => {
  res.json({ message: "Email verification not implemented in MVP base" });
};

export const forgotPassword: RequestHandler = async (req, res, next) => {
  res.json({ message: "Forgot password not implemented in MVP base" });
};

export const resetPassword: RequestHandler = async (req, res, next) => {
  res.json({ message: "Reset password not implemented in MVP base" });
};
