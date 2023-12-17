import { create } from 'zustand';

export type UserState = {
  user: DataUser | undefined;
}

export type DataUser = {
  id:        string;
  name:      string;
  email:     string;
  cpf:       string;
  ra:        string;
  role:      string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  status:    string;
}

export type UserActions = {
  setUser: (user: UserState) => void;
  removeUser: () => void
}

export type User = {
  state: UserState;
  actions: UserActions;
}

export const useUserStore = create<User>((set) => ({
  state: {
    user: undefined
  },
  actions: {
    setUser: (user: UserState) => set((state: any) => ({ state: { ...state.state, user } })),
    removeUser: () => set({ state: { user: undefined } }),
  }
}));
