import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserData = {
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
  image:     string;
}

export type UserStoreProps = {
  user: UserData | undefined;
  setUser: (user: UserData) => void;
  removeUser: () => void
}

export const useUserStore = create(persist<UserStoreProps>((set, get) => ({
  user: undefined,
  setUser: (user: UserData) => set(() => ({...get(), user})),
  removeUser: () => set(() => ({...get(), user: undefined})),
}), {name: 'user-store'}));

