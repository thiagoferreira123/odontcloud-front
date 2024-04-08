import { create } from "zustand";
import { CaloricExpenditure } from "../../../../types/CaloricExpenditure";

interface DeleteConfirmationStore {
  showModal: boolean;

  selectedExpenditure: CaloricExpenditure | null;

  // eslint-disable-next-line no-unused-vars
  handleDeleteExpenditure: (expenditure: CaloricExpenditure) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationStore = create<DeleteConfirmationStore>((set) => ({
  showModal: false,

  selectedExpenditure: null,

  handleDeleteExpenditure(expenditure) {
    set({ selectedExpenditure: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedExpenditure: null });
  },
}));