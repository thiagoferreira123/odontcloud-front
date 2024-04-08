import { create } from "zustand";

interface FilterStore {
  query: string;
  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  query: '',

  setQuery: (query: string) => set({ query }),
}))