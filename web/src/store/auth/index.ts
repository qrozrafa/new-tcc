import { create } from 'zustand';

export type AuthState = {
  token: string;
}

export type AuthActions = {
  setToken: (token: string) => void;
  removeToken: () => void;
}

export type Auth = {
  state: AuthState;
  actions: AuthActions;
}

export const useAuthStore = create<Auth>((set) => ({
  state: {
    token: '',
  },
  actions: {
    setToken: (token: string) => set((state) => ({ state: { ...state.state, token } })),
    removeToken: () => set((state) => ({ state: { ...state.state, token: '' } })),
  }
}));
