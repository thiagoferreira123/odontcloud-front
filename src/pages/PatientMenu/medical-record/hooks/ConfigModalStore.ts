import { create } from "zustand";
import { MedicalRecord } from "./types";

interface ConfigModalStore {
  showModal: boolean;

  selectedMedicalRecord: MedicalRecord | null;

  hideConfigModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectMedicalRecord: (assessment: MedicalRecord) => void;
  handleShowConfigModal: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedMedicalRecord: null,

  hideConfigModal: () => {
    set({ showModal: false, selectedMedicalRecord: null });
  },

  handleSelectMedicalRecord: (assessment) => {
    set({ selectedMedicalRecord: assessment, showModal: true });
  },

  handleShowConfigModal: () => {
    set({ showModal: true, selectedMedicalRecord: null });
  },
}));