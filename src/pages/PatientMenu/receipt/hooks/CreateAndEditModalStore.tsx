import { create } from "zustand";
import { Receipt } from "./ReceiptStore/types";

interface CreateAndEditModalStore {
  showModal: boolean;

  selectedReceipt: Receipt | null;

  handleSelectReceiptToEdit: (expenditure: Receipt) => void;
  openModal: () => void;
  hideModal: () => void;
}

export const useCreateAndEditModalStore = create<CreateAndEditModalStore>((set) => ({
  showModal: false,

  selectedReceipt: null,

  handleSelectReceiptToEdit(expenditure) {
    set({ selectedReceipt: expenditure, showModal: true });
  },

  openModal() {
    set({ showModal: true, selectedReceipt: null });
  },

  hideModal() {
    set({ showModal: false, selectedReceipt: null });
  },
}));