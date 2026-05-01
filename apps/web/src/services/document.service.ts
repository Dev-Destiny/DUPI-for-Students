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

	/** 
	 * Fetches a single document by ID.
	 */
	getDocumentById: async (id: string) => {
		const response = await api.get(`/documents/${id}`);
		return response.data.document;
	},

	/**
	 * Deletes a document by ID.
	 */
	deleteDocument: async (id: string) => {
		const response = await api.delete(`/documents/${id}`);
		return response.data;
	},

	/**
	 * Regenerates a summary for an already processed document.
	 */
	regenerateSummary: async (id: string) => {
		const response = await api.post(`/documents/${id}/regenerate-summary`);
		return response.data;
	},
};
