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

  generateFlashcards: async (data: { documentId: string; count?: number; difficulty?: string; topic?: string }) => {
    const response = await api.post("/flashcards/generate", data);
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
  deleteFlashcard: async (id: string) => {
    const response = await api.delete(`/flashcards/${id}`);
    return response.data;
  },

  deleteFlashcardSet: async (documentId: string) => {
    const response = await api.delete(`/flashcards`, {
      params: { documentId }
    });
    return response.data;
  },
};
