import { Request, Response, NextFunction } from "express";
import * as analyticsService from "../services/analytics.service";

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = req.user?.userId;
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const analytics = await analyticsService.getUserAnalytics(userId);
		res.json(analytics);
	} catch (error) {
		next(error);
	}
};
