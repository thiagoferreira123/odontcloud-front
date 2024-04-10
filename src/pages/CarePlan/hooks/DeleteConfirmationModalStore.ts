import { create } from "zustand";
import { Procedure } from "./ProcedureStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedProcedure: Procedure | null;

  handleSelectProcedureToRemove: (careplan: Procedure) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedProcedure: null,

  handleSelectProcedureToRemove(careplan) {
    set({ selectedProcedure: careplan, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedProcedure: null });
  },
}));