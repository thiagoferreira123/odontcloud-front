import { create } from "zustand";
import { NutritionalGuidanceSelectedPatient } from "./types";

interface ConfigModalStore {
  showModal: boolean;

  selectedNutritionalGuidanceSelectedPatient: NutritionalGuidanceSelectedPatient | null;

  hideConfigModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectNutritionalGuidanceSelectedPatient: (assessment: NutritionalGuidanceSelectedPatient) => void;
  showConfigModal: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedNutritionalGuidanceSelectedPatient: null,

  hideConfigModal: () => {
    set({ showModal: false, selectedNutritionalGuidanceSelectedPatient: null });
  },

  handleSelectNutritionalGuidanceSelectedPatient: (assessment) => {
    set({ selectedNutritionalGuidanceSelectedPatient: assessment, showModal: true });
  },

  showConfigModal: () => {
    set({ showModal: true, selectedNutritionalGuidanceSelectedPatient: null });
  },
}));