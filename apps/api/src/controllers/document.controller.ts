import { RequestHandler } from "express";
import { ApiError } from "../utils/ApiError";
import * as documentService from "../services/document.service";

export const upload: RequestHandler = async (req, res, next) => {
	try {
		// console.log(req.user)
		if (!req.file) {
			throw new ApiError(400, "VALIDATION_ERROR", "No file uploaded.");
		}

		const userId = req.user?.userId;
		if (!userId) {
			throw new ApiError(401, "AUTH_REQUIRED", "User not authenticated.");
		}

		const newDocument = await documentService.uploadAndCreateDocument(req.file, userId);

		res.status(201).json({
			message: "Document uploaded. AI processing has started in the background.",
			document: newDocument,
		});
	} catch (error) {
		next(error);
	}
};

export const list: RequestHandler = async (req, res, next) => {
	try {
		const userId = req.user?.userId;
		if (!userId) {
			throw new ApiError(401, "AUTH_REQUIRED", "User not authenticated.");
		}

		const documents = await documentService.getDocumentsByUser(userId);
		res.json(documents);
	} catch (error) {
		next(error);
	}
};

export const get: RequestHandler = async (req, res, next) => {
	try {
		const userId = req.user?.userId;
		const id = req.params.id as string;
		if (!userId) {
			throw new ApiError(401, "AUTH_REQUIRED", "USER_NOT_AUTHENTICATED");
		}

		const document = await documentService.getDocumentById(id, userId);
		res.json({ document });
	} catch (error) {
		next(error);
	}
};

export const remove: RequestHandler = async (req, res, next) => {
	try {
		const userId = req.user?.userId;
		const id = req.params.id as string;
		if (!userId) {
			throw new ApiError(401, "AUTH_REQUIRED", "USER_NOT_AUTHENTICATED");
		}

		const document = await documentService.deleteDocument(id, userId);
		res.json({ document });
	} catch (error) {
		next(error);
	}
};

export const status: RequestHandler = async (req, res, next) => {
	res.json({ message: "Document status endpoint stub" });
};
