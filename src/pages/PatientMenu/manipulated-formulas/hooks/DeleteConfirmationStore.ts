import { create } from "zustand";
import { ManipulatedFormula } from ".";

interface DeleteConfirmationStore {
  showModal: boolean;

  selectedManipulatedFormula: ManipulatedFormula | null;

  // eslint-disable-next-line no-unused-vars
  handleDeleteManipulatedFormula: (expenditure: ManipulatedFormula) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationStore = create<DeleteConfirmationStore>((set) => ({
  showModal: false,

  selectedManipulatedFormula: null,

  handleDeleteManipulatedFormula(expenditure) {
    set({ selectedManipulatedFormula: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedManipulatedFormula: null });
  },
}));