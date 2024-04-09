import { create } from "zustand";
import { Professional } from "./ProfessionalStore/types";

interface CreateAndEditModalStore {
  showModal: boolean;

  selectedProfessional: Professional | null;

  handleSelectProfessionalToEdit: (expenditure: Professional) => void;
  openCreateAndEditModal: () => void;
  hideModal: () => void;
}

export const useCreateAndEditModalStore = create<CreateAndEditModalStore>((set) => ({
  showModal: false,

  selectedProfessional: null,

  handleSelectProfessionalToEdit(expenditure) {
    set({ selectedProfessional: expenditure, showModal: true });
  },

  openCreateAndEditModal() {
    set({ showModal: true, selectedProfessional: null });
  },

  hideModal() {
    set({ showModal: false, selectedProfessional: null });
  },
}));