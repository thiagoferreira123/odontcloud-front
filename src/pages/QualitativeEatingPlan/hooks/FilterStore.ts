import { create } from "zustand";
import { Option } from "../../../types/inputs";

interface FilterStore {
  qualitativeEatingPlanMealOptions: Option[];
  query: string;

  // eslint-disable-next-line no-unused-vars
  setQualitativeEatingPlanMealOptions: (options: Option[]) => void;
  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  qualitativeEatingPlanMealOptions: [],
  query: '',

  setQualitativeEatingPlanMealOptions: (qualitativeEatingPlanMealOptions: Option[]) => set({ qualitativeEatingPlanMealOptions }),
  setQuery: (query: string) => set({ query }),
}))