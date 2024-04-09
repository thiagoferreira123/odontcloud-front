import { create } from "zustand";
import { CarePlanBudget } from "./CarePlanBudgetStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedCarePlanBudget: CarePlanBudget | null;

  handleSelectCarePlanBudgetToRemove: (careplan: CarePlanBudget) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedCarePlanBudget: null,

  handleSelectCarePlanBudgetToRemove(careplan) {
    set({ selectedCarePlanBudget: careplan, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedCarePlanBudget: null });
  },
}));