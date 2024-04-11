import { create } from "zustand";
import { CarePlanBudgetHistoryItem } from "./CarePlanBudgetHistoryItem/types";

interface ModalTransactionConfirmationModalStore {
  showModal: boolean;
  selectedPayment: CarePlanBudgetHistoryItem | null;

  openModalDayOffModal: (selectedPayment: CarePlanBudgetHistoryItem) => void;
  hideModal: () => void;
}

export const useModalTransactionConfirmationModalStore = create<ModalTransactionConfirmationModalStore>((set) => ({
  showModal: false,
  selectedPayment: null,

  openModalDayOffModal(selectedPayment) {
    set({ showModal: true, selectedPayment });
  },

  hideModal() {
    set({ showModal: false });
  },
}));