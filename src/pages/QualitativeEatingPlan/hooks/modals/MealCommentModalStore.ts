import { create } from "zustand";
import { QualitativeEatingPlanMeal } from "../../../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types";

interface MealCommentModalStore {
  selectedMeal: QualitativeEatingPlanMeal | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleSelectMealToUpdateComment: (meal: QualitativeEatingPlanMeal) => void;
  closeModal: () => void;
}

export const useMealCommentModalStore = create<MealCommentModalStore>(set => ({
  selectedMeal: null,
  showModal: false,

  handleSelectMealToUpdateComment: (selectedMeal) => set({ selectedMeal, showModal: true }),
  closeModal: () => set({ showModal: false, selectedMeal: null }),
}))