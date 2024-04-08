import { create } from "zustand";
import { QualitativeEatingPlanMeal } from "../../../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types";

interface DeleteMealConfirmationModalStore {
  showModal: boolean;

  selectedMeal: QualitativeEatingPlanMeal | null;

  // eslint-disable-next-line no-unused-vars
  handleDeleteQualitativeEatingPlanMeal: (selectedMeal: QualitativeEatingPlanMeal) => void;
  hideModal: () => void;
}

export const useDeleteMealConfirmationModalStore = create<DeleteMealConfirmationModalStore>((set) => ({
  showModal: false,

  selectedMeal: null,

  handleDeleteQualitativeEatingPlanMeal: (selectedMeal) => set({ selectedMeal, showModal: true }),
  hideModal: () => set({ showModal: false }),
}));