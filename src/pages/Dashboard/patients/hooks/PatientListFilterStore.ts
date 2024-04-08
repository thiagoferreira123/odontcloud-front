import { create } from "zustand";

interface PatientListFilterStore {
  query: string;
  category: string;

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
  // eslint-disable-next-line no-unused-vars
  setCategory: (category: string) => void;
}

export const usePatientListFilterStore = create<PatientListFilterStore>((set) => ({
  query: '',
  category: 'Todos',

  setQuery: (query: string) => {
    set(() => ({ query }));
  },
  setCategory: (category: string) => {
    set(() => ({ category }));
  },
}));