import { create } from "zustand";
import { ReceiptDetails } from "./ReceiptStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedReceipt: ReceiptDetails | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectReceiptToRemove: (expenditure: ReceiptDetails) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedReceipt: null,

  handleSelectReceiptToRemove(expenditure) {
    set({ selectedReceipt: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedReceipt: null });
  },
}));