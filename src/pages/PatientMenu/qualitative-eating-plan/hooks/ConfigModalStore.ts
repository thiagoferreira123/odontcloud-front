import { create } from "zustand";
import { QualitativeEatingPlan } from "./eating-plan/types";

interface ConfigModalStore {
  showModal: boolean;
  selectedQualitativeEatingPlan: QualitativeEatingPlan | null;
  // eslint-disable-next-line no-unused-vars
  setShowModalConfig: () => void;
  hideConfigModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectQualitativeEatingPlan: (expenditure: QualitativeEatingPlan | null) => void;
  clearSelectedQualitativeEatingPlan: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedQualitativeEatingPlan: null,

  setShowModalConfig: () => set({ showModal: true, selectedQualitativeEatingPlan: null }),
  hideConfigModal: () => set({ showModal: false, selectedQualitativeEatingPlan: null }),

  handleSelectQualitativeEatingPlan: (expenditure) => set({ selectedQualitativeEatingPlan: expenditure, showModal: true }),
  clearSelectedQualitativeEatingPlan: () => set({ selectedQualitativeEatingPlan: null }),
}));