import { create } from "zustand";
import { AntropometricAssessmentHistory } from '/src/types/AntropometricAssessment';


interface ConfigModalStore {
  showModal: boolean;

  selectedAssessment: AntropometricAssessmentHistory<unknown> | null;

  hideConfigModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectAssessment: (assessment: AntropometricAssessmentHistory<unknown>) => void;
  clearSelectedAssessment: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedAssessment: null,

  hideConfigModal: () => {
    set({ showModal: false });
  },

  handleSelectAssessment: (assessment) => {
    set({ selectedAssessment: assessment, showModal: true });
  },
  clearSelectedAssessment: () => {
    set({ selectedAssessment: null });
  },
}));