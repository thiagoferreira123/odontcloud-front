import { AntropometricAssessmentHistory } from "/src/types/AntropometricAssessment";
import { create } from "zustand";

interface DeletConfirmationModalStore {
  showModal: boolean;

  selectedAssessment: AntropometricAssessmentHistory | null;

  // eslint-disable-next-line no-unused-vars
  handleDeleteAssessment: (selectedAssessment: AntropometricAssessmentHistory) => void;
  hideModal: () => void;
}

export const useDeletConfirmationModalStore = create<DeletConfirmationModalStore>((set) => ({
  showModal: false,

  selectedAssessment: null,

  handleDeleteAssessment: (selectedAssessment) => set({ selectedAssessment, showModal: true }),
  hideModal: () => set({ showModal: false }),
}));