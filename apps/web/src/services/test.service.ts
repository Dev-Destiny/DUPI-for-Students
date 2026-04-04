import { api } from "@/lib/axios";

export const testService = {
  getTests: async () => {
    const response = await api.get("/tests");
    return response.data;
  },

  getTestById: async (id: string) => {
    const response = await api.get(`/tests/${id}`);
    return response.data;
  },

  generateTest: async (data: { documentId?: string; topic?: string; count?: number; difficulty?: string }) => {
    const response = await api.post("/tests/generate", data);
    return response.data;
  },

  submitAttempt: async (id: string, answers: Record<string, any>, timeSpentSeconds?: number) => {
    const response = await api.post(`/tests/${id}/attempt`, { answers, timeSpentSeconds });
    return response.data;
  },

  getAttempts: async (id: string) => {
    const response = await api.get(`/tests/${id}/attempts`);
    return response.data;
  },
};
