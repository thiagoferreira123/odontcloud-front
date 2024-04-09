import { create } from "zustand";
import { Professional } from "./ProfessionalStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedProfessional: Professional | null;

  handleSelectProfessionalToRemove: (expenditure: Professional) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedProfessional: null,

  handleSelectProfessionalToRemove(expenditure) {
    set({ selectedProfessional: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedProfessional: null });
  },
}));