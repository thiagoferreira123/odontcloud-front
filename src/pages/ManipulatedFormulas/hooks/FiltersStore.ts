import { create } from "zustand";
import { Option } from "../../../types/inputs";

interface FiltersStore {
  selectedCategories: Option[];
  showOnlyMyTemplates: boolean;
  query: string;

  setSelectedCategories: (categories: Option[]) => void;
  setQuery: (query: string) => void;
  setOnlyMyTemplates: (showOnlyMyTemplates: boolean) => void;
}

export const useFiltersStore =create<FiltersStore>((set) => ({
  selectedCategories: [],
  query: '',
  showOnlyMyTemplates: false,

  setSelectedCategories: (categories: Option[]) => {
    set(() => ({ selectedCategories: categories }));
  },
  setQuery: (query: string) => {
    set(() => ({ query }));
  },
  setOnlyMyTemplates: (showOnlyMyTemplates: boolean) => {
    set(() => ({ showOnlyMyTemplates }));
  },
}));