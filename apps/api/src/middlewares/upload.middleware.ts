import multer from "multer";
import { ApiError } from "../utils/ApiError";

// Configure memory storage
const storage = multer.memoryStorage();

// Validate file types and size (50MB)
export const uploadMiddleware = multer({
	storage,
	limits: { fileSize: 50 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowedMimeTypes = [
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"text/plain",
		];
		if (allowedMimeTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new ApiError(400, "VALIDATION_FILE_TYPE", "Invalid file type. Only PDF, DOCX, and TXT are allowed."));
		}
	},
});
