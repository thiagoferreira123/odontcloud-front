import { create } from "zustand";
import { ChecklistConduct } from "./ChecklistConductsStore/types";

interface ConfigModalStore {
  showModal: boolean;

  selectedChecklistConduct: ChecklistConduct | null;

  hideConfigModal: () => void;
  handleSelectChecklistConduct: (assessment: ChecklistConduct) => void;
  handleShowModal: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedChecklistConduct: null,

  hideConfigModal: () => {
    set({ showModal: false, selectedChecklistConduct: null });
  },

  handleSelectChecklistConduct: (assessment) => {
    set({ selectedChecklistConduct: assessment, showModal: true });
  },

  handleShowModal: () => {
    set({ showModal: true, selectedChecklistConduct: null });
  },
}));