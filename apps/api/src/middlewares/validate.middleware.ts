import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate = (schema: AnyZodObject) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			req.body = result.body;
			Object.assign(req.query, result.query);
			Object.assign(req.params, result.params);
			return next();
		} catch (error) {
			if (error instanceof ZodError) {
				return next(
					new ApiError(
						400,
						"VALIDATION_ERROR",
						error.errors[0].message,
					),
				);
			}
			return next(error);
		}
	};
};
