import { create } from "zustand";
import { Transaction } from "./TransactionStore/types";

interface CreateTransactionModalStore {
  showModal: boolean;

  selectedTransaction: Transaction | null;

  hideModal: () => void;
  handleSelectTransactionToEdit: (transaction: Transaction) => void;
  handleChangeTransaction: (transaction: Partial<Transaction>) => void;
  handleShowCreateTransactionModal: () => void;
}

export const useCreateTransactionModalStore = create<CreateTransactionModalStore>((set) => ({
  showModal: false,
  selectedTransaction: null,

  hideModal: () => {
    set({ showModal: false, selectedTransaction: null });
  },

  handleSelectTransactionToEdit: (transaction) => {
    set({ selectedTransaction: transaction, showModal: true });
  },

  handleChangeTransaction: (transaction) => {
    set(state => {
      if (!state.selectedTransaction) return state;
      return { selectedTransaction: { ...state.selectedTransaction, ...transaction } }
    });
  },

  handleShowCreateTransactionModal: () => {
    set({ showModal: true, selectedTransaction: null });
  },
}));