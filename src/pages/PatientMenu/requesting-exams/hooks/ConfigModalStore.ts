import { RequestingExam } from "/src/types/RequestingExam";
import { create } from "zustand";

interface ConfigModalStore {
  showModal: boolean;

  selectedExam: RequestingExam | null;

  hideConfigModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectExam: (assessment: RequestingExam) => void;
  clearSelectedExam: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedExam: null,

  hideConfigModal: () => {
    set({ showModal: false });
  },

  handleSelectExam: (assessment) => {
    set({ selectedExam: assessment, showModal: true });
  },
  clearSelectedExam: () => {
    set({ selectedExam: null });
  },
}));