import { create } from "zustand";

interface FilterStore {
  query: string;
  setQuery: (query: string) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  query: '',

  setQuery: (query: string) => set({ query }),
}))