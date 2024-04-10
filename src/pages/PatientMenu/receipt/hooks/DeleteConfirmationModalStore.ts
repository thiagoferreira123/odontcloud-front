import { create } from "zustand";
import { Receipt } from "./ReceiptStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedReceipt: Receipt | null;

  handleSelectReceiptToRemove: (expenditure: Receipt) => void;
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