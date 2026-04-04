import { ErrorRequestHandler } from "express";
import { ApiError, ErrorResponse } from "../utils/ApiError";

export const errorHandler:ErrorRequestHandler = (err, req, res, next) => {
	if (err instanceof ApiError) {
		const response: ErrorResponse = {
			error: {
				code: err.code,
				message: err.message,
				details: err.details,
				timestamp: new Date().toISOString(),
			},
		};

		return res.status(err.statusCode).json(response);
	}

	console.error(err);

	return res.status(500).json({
		error: {
			code: "SERVER_INTERNAL_ERROR",
			message: "An internal server error occurred",
			timestamp: new Date().toISOString(),
		},
	});
};
