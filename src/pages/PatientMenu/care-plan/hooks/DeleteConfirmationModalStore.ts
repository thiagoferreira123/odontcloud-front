import { create } from "zustand";
import { CarePlan } from "./CarePlanStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedCarePlan: CarePlan | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectCarePlanToRemove: (careplan: CarePlan) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedCarePlan: null,

  handleSelectCarePlanToRemove(careplan) {
    set({ selectedCarePlan: careplan, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedCarePlan: null });
  },
}));