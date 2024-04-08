import { create } from "zustand";

interface PatientListFilterStore {
  query: string;

  setQuery: (query: string) => void;
}

export const usePatientListFilterStore = create<PatientListFilterStore>((set) => ({
  query: '',

  setQuery: (query: string) => {
    set(() => ({ query }));
  },
}));