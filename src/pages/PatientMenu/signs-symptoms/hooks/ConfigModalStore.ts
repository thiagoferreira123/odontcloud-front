import { create } from "zustand";
import { SignsSymptoms } from "./SignsSymptomsStore/types";

interface ConfigModalStore {
  showModal: boolean;

  selectedSignsSymptoms: SignsSymptoms | null;

  hideConfigModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectSignsSymptoms: (assessment: SignsSymptoms) => void;
  handleShowModal: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedSignsSymptoms: null,

  hideConfigModal: () => {
    set({ showModal: false, selectedSignsSymptoms: null });
  },

  handleSelectSignsSymptoms: (assessment) => {
    set({ selectedSignsSymptoms: assessment, showModal: true });
  },

  handleShowModal: () => {
    set({ showModal: true, selectedSignsSymptoms: null });
  },
}));