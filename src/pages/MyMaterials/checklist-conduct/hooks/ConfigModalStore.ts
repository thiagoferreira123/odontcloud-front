import { create } from "zustand";
import { ChecklistConductTemplate } from "../../../PatientMenu/checklist-conduct/hooks/ChecklistConductTemplatesStore/types";

interface ConfigModalStore {
  showModal: boolean;

  selectedChecklistConductTemplate: ChecklistConductTemplate | null;

  hideConfigModal: () => void;
  handleSelectChecklistConductTemplate: (assessment: ChecklistConductTemplate) => void;
  handleShowModal: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedChecklistConductTemplate: null,

  hideConfigModal: () => {
    set({ showModal: false, selectedChecklistConductTemplate: null });
  },

  handleSelectChecklistConductTemplate: (assessment) => {
    set({ selectedChecklistConductTemplate: assessment, showModal: true });
  },

  handleShowModal: () => {
    set({ showModal: true, selectedChecklistConductTemplate: null });
  },
}));