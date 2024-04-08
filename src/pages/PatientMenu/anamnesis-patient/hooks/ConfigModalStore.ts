import { create } from "zustand";
import { Anamnesis } from "./AnamnesisStore/types";

interface ConfigModalStore {
  showModal: boolean;

  selectedAnamnesis: Anamnesis | null;

  hideConfigModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectAnamnesis: (assessment: Anamnesis) => void;
  handleShowModal: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedAnamnesis: null,

  hideConfigModal: () => {
    set({ showModal: false, selectedAnamnesis: null });
  },

  handleSelectAnamnesis: (assessment) => {
    set({ selectedAnamnesis: assessment, showModal: true });
  },

  handleShowModal: () => {
    set({ showModal: true, selectedAnamnesis: null });
  },
}));