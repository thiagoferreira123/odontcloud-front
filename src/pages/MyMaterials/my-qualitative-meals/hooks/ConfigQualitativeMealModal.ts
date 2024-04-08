import { create } from "zustand";
import { QualitativeMeal } from "./MyQualitativeMeals";

interface ConfigQualitativeMealModalStore {
  selectedMeal: QualitativeMeal | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleSelectMeal: (meal: QualitativeMeal) => void;
  handleOpenConfigModal: () => void;
  closeModal: () => void;
}

export const useConfigQualitativeMealModalStore = create<ConfigQualitativeMealModalStore>(set => ({
  selectedMeal: null,
  showModal: false,

  handleSelectMeal: (selectedMeal) => set({ selectedMeal, showModal: true }),
  handleOpenConfigModal: () => set({ showModal: true, selectedMeal: null }),
  closeModal: () => set({ showModal: false, selectedMeal: null }),
}))