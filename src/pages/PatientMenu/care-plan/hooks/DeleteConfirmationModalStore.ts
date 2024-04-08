import { create } from "zustand";
import { CarePlanDetails } from "./CarePlanStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedCarePlan: CarePlanDetails | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectCarePlanToRemove: (careplan: CarePlanDetails) => void;
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