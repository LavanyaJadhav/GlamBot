import { create, StateCreator } from 'zustand';
import { auth } from '@/lib/api';

interface User {
  user_id: number;
  name: string;
  email: string;
  gender?: string;
  fashion_preference?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    gender?: string;
    fashion_preference?: string;
  }) => Promise<void>;
  logout: () => void;
}

const useAuth = create<AuthState>((set: StateCreator<AuthState>) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await auth.login(email, password);
      localStorage.setItem('auth_token', response.token);
      set({ user: response.user, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to login',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    gender?: string;
    fashion_preference?: string;
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await auth.register(userData);
      localStorage.setItem('auth_token', response.token);
      set({ user: response.user, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to register',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null });
  },
}));

export default useAuth; 