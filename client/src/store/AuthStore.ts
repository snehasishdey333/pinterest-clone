import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  image?: string;
}

interface AuthState {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  updateCurrentUser: (user: User) => void;
  removeCurrentUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      removeCurrentUser: () => set({ currentUser: null }),
      updateCurrentUser:(user)=>set({currentUser:user})
    }),
    {
      name: 'auth-storage', 
    }
  )
);
