import { create } from "zustand";

interface MyManipulatedFormulasStore {

  query: string;

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
}

export const useMyManipulatedFormulasStore = create<MyManipulatedFormulasStore>((set) => ({
  query: '',

  setQuery: (query) => set({ query }),
}));