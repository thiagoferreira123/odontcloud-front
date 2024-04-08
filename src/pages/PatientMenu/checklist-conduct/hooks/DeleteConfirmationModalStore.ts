import { create } from "zustand";
import { ChecklistConduct } from "./ChecklistConductsStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedChecklistConduct: ChecklistConduct | null;

  handleSelectChecklistConductToRemove: (checklist: ChecklistConduct) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedChecklistConduct: null,

  handleSelectChecklistConductToRemove(checklist) {
    set({ selectedChecklistConduct: checklist, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedChecklistConduct: null });
  },
}));