import { create } from 'zustand';

interface MyMaterialsStore {
  query: string;

  setQuery: (query: string) => void;
}

const useMyMaterialsStore = create<MyMaterialsStore>((set) => ({
  query: '',

  setQuery: (query) => set({ query }),
}));

export default useMyMaterialsStore;
