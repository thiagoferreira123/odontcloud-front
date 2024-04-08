import { create } from "zustand";
import { QualitativeEatingPlanMeal } from "../../../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types";

interface FavoriteMealModalStore {
  selectedMeal: QualitativeEatingPlanMeal | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleSelectMealAsTemplate: (meal: QualitativeEatingPlanMeal) => void;
  closeModal: () => void;
}

export const useFavoriteMealModal = create<FavoriteMealModalStore>(set => ({
  selectedMeal: null,
  showModal: false,

  handleSelectMealAsTemplate: (selectedMeal) => set({ selectedMeal, showModal: true }),
  closeModal: () => set({ showModal: false, selectedMeal: null }),
}))