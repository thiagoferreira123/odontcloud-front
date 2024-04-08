import { create } from "zustand";
import { CarePlanDetails } from "./CarePlanDetailsStore/types";

interface CreateAndEditModalStore {
  showModal: boolean;

  selectedCarePlan: CarePlanDetails | null;

  handleSelectCarePlanToEdit: (careplan: CarePlanDetails) => void;
  openModal: () => void;
  hideModal: () => void;
}

export const useCreateAndEditModalStore = create<CreateAndEditModalStore>((set) => ({
  showModal: false,

  selectedCarePlan: null,

  handleSelectCarePlanToEdit(careplan) {
    set({ selectedCarePlan: careplan, showModal: true });
  },

  openModal() {
    set({ showModal: true, selectedCarePlan: null });
  },

  hideModal() {
    set({ showModal: false, selectedCarePlan: null });
  },
}));