import { api } from "@/lib/axios";

export const documentService = {
	/**
	 * Uploads a document to the server.
	 * @param file The file to upload
	 */
	uploadDocument: async (file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		const response = await api.post("/documents/upload", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	},

	/**
	 * Fetches all documents for the authenticated user.
	 */
	getDocuments: async () => {
		const response = await api.get("/documents");
		return response.data;
	},

	// We can add other document API calls here like delete, status, etc.
};
