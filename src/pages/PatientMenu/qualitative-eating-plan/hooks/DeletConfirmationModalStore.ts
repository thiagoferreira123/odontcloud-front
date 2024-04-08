import { create } from "zustand";
import { QualitativeEatingPlan } from "./eating-plan/types";

interface DeletConfirmationModalStore {
  showModal: boolean;

  selectedQualitativeEatingPlan: QualitativeEatingPlan | null;

  // eslint-disable-next-line no-unused-vars
  handleDeleteQualitativeEatingPlan: (selectedQualitativeEatingPlan: QualitativeEatingPlan) => void;
  hideModal: () => void;
}

export const useDeletConfirmationModalStore = create<DeletConfirmationModalStore>((set) => ({
  showModal: false,

  selectedQualitativeEatingPlan: null,

  handleDeleteQualitativeEatingPlan: (selectedQualitativeEatingPlan) => set({ selectedQualitativeEatingPlan, showModal: true }),
  hideModal: () => set({ showModal: false }),
}));