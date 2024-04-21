import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubjectData = {
  id:        string;
  name:      string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  status:    string;
  countAds:  number;
}

export type SubjectsStoreProps = {
  subjects: SubjectData[] | [];
  setSubjects: (Subjects: SubjectData[]) => void;
  removeSubjects: () => void
}

export const useSubjectsStore = create(persist<SubjectsStoreProps>((set, get) => ({
  subjects: [],
  setSubjects: (subjects: SubjectData[]) => set(() => ({...get(), subjects})),
  removeSubjects: () => set(() => ({...get(), subjects: []})),
}), {name: 'subjects-store'}));

