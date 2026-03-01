import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/axios";
import { 
  type User, 
  type LoginInput, 
  type SignupInput, 
  type AuthResponse 
} from "@dupi/shared";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;

  login: (data: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setAccessToken: (token: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,

      login: async (data: LoginInput) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>("/auth/login", data);
          set({ 
            user: response.data.user, 
            accessToken: response.data.accessToken,
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || "Login failed" 
          });
          throw error;
        }
      },

      signup: async (data: SignupInput) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>("/auth/register", data);
          
          set({ 
            user: response.data.user, 
            accessToken: response.data.accessToken,
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || "Sign up failed" 
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } finally {
          set({ 
            user: null, 
            accessToken: null,
            isAuthenticated: false, 
            error: null 
          });
          // Also clear persisted state if needed, though logout usually clears these.
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get<User>("/auth/me");
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            user: null, 
            accessToken: null,
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        console.log('[DEBUG] authStore.updateProfile called with:', data);
        set({ isLoading: true, error: null });
        try {
          const response = await api.put<User>("/auth/update-profile", data);
          console.log('[DEBUG] authStore.updateProfile response:', response.data);
          set({ user: response.data, isLoading: false });
        } catch (error: any) {
          console.error('[DEBUG] authStore.updateProfile error:', error);
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || "Update failed" 
          });
          throw error;
        }
      },

      setAccessToken: (token: string) => set({ accessToken: token }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "dupi-auth",
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken 
      }),
    }
  )
);
