import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export type AuthStoreProps = {
  token: string;
  authenticated: boolean;
  setToken: (token: string) => void;
  removeToken: () => void;
}

export const useAuthStore = create(persist<AuthStoreProps>((set, get) => ({
  token: '',
  authenticated: false,
  setToken: (token: string) => set(() => ({ ...get(), token, authenticated: true })),
  removeToken: () => set(() => ({ ...get(), token: '', authenticated: false })),
}), {name: 'auth-store'}));
