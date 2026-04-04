import { api } from "@/lib/axios";

export const flashcardService = {
  getFlashcards: async () => {
    const response = await api.get("/flashcards");
    return response.data;
  },

  getDueFlashcards: async () => {
    const response = await api.get("/flashcards/due");
    return response.data;
  },

  generateFlashcards: async (documentId: string, count?: number) => {
    const response = await api.post("/flashcards/generate", { documentId, count });
    return response.data;
  },

  createFlashcard: async (data: { documentId?: string; front: string; back: string; tags?: string[] }) => {
    const response = await api.post("/flashcards", data);
    return response.data;
  },

  reviewFlashcard: async (id: string, quality: number) => {
    const response = await api.post(`/flashcards/${id}/review`, { quality });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/flashcards/stats");
    return response.data;
  },
};
