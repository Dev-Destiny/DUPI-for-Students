import mammoth from "mammoth";
import { ApiError } from "../utils/ApiError";
import { PDFParse } from "pdf-parse";
// import PdfParse from "pdf-parse";

/**
 * Service to extract raw text from various document formats.
 */
export const extractionService = {
	/**
	 * Extracts text from a buffer based on the file type.
	 */
	extractText: async (buffer: Buffer, mimeType: string): Promise<string> => {
		try {
			if (mimeType === "application/pdf") {
				return await extractionService.extractPdf(buffer);
			} else if (
				mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
				mimeType === "application/msword"
			) {
				return await extractionService.extractDocx(buffer);
			} else if (mimeType.startsWith("text/")) {
				return buffer.toString("utf-8");
			} else {
				throw new ApiError(400, "UNSUPPORTED_TYPE", `Unsupported file type: ${mimeType}`);
			}
		} catch (error: any) {
			console.error("Text Extraction Error:", error);
			if (error instanceof ApiError) throw error;
			throw new ApiError(500, "EXTRACTION_ERROR", `Failed to extract text: ${error.message}`);
		}
	},

	/**
	 * Private helper for PDF extraction.
	 */
	extractPdf: async (buffer: Buffer): Promise<string> => {
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getText();
		return result.text;
	},

	/**
	 * Private helper for Word (.docx) extraction.
	 */
	extractDocx: async (buffer: Buffer): Promise<string> => {
		const result = await mammoth.extractRawText({ buffer });
		return result.value;
	}
};
