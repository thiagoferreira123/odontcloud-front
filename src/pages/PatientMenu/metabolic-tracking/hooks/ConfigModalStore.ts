import { create } from "zustand";
import { MetabolicTracking } from "./MetabolicTracking/types";

interface ConfigModalStore {
  showModal: boolean;

  selectedMetabolicTracking: MetabolicTracking | null;

  hideConfigModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectMetabolicTracking: (assessment: MetabolicTracking) => void;
  handleShowModal: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedMetabolicTracking: null,

  hideConfigModal: () => {
    set({ showModal: false, selectedMetabolicTracking: null });
  },

  handleSelectMetabolicTracking: (assessment) => {
    set({ selectedMetabolicTracking: assessment, showModal: true });
  },

  handleShowModal: () => {
    set({ showModal: true, selectedMetabolicTracking: null });
  },
}));