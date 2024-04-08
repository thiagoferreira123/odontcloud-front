import { create } from "zustand";

interface ForumTopicFilterStore {
  query: string;
  categories: number[];

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
  // eslint-disable-next-line no-unused-vars
  setCategories: (categories: number[]) => void;
}

export const useForumTopicFilterStore = create<ForumTopicFilterStore>((set) => ({
  query: '',
  categories: [],

  setQuery: (query) => {
    set(() => ({ query }));
  },
  setCategories: (categories) => {
    set(() => ({ categories }));
  },
}));