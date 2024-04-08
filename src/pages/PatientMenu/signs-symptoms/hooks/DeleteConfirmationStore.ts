import { create } from "zustand";
import { SignsSymptoms } from "./SignsSymptomsStore/types";

interface DeleteConfirmationStore {
  showModal: boolean;

  selectedSignsSymptom: SignsSymptoms | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectSignsSymptomsToRemove: (expenditure: SignsSymptoms) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationStore = create<DeleteConfirmationStore>((set) => ({
  showModal: false,

  selectedSignsSymptom: null,

  handleSelectSignsSymptomsToRemove(expenditure) {
    set({ selectedSignsSymptom: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedSignsSymptom: null });
  },
}));