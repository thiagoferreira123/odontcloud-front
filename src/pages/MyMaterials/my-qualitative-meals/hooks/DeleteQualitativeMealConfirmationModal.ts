import { create } from "zustand";
import { QualitativeMeal } from "./MyQualitativeMeals";

interface DeleteQualitativeMealConfirmationModalStore {
  selectedMeal: QualitativeMeal | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleSelectMealToDelete: (meal: QualitativeMeal) => void;
  closeModal: () => void;
}

export const useDeleteQualitativeMealConfirmationModal = create<DeleteQualitativeMealConfirmationModalStore>(set => ({
  selectedMeal: null,
  showModal: false,

  handleSelectMealToDelete: (selectedMeal) => set({ selectedMeal, showModal: true }),
  closeModal: () => set({ showModal: false, selectedMeal: null }),
}))