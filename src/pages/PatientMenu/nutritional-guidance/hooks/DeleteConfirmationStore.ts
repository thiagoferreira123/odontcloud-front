import { create } from "zustand";
import { NutritionalGuidanceSelectedPatient } from "./types";

interface DeleteConfirmationStore {
  showModal: boolean;

  selectedNutritionalGuidanceSelectedPatient: NutritionalGuidanceSelectedPatient | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectNutritionalGuidanceSelectedPatientToRemove: (expenditure: NutritionalGuidanceSelectedPatient) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationStore = create<DeleteConfirmationStore>((set) => ({
  showModal: false,

  selectedNutritionalGuidanceSelectedPatient: null,

  handleSelectNutritionalGuidanceSelectedPatientToRemove(expenditure) {
    set({ selectedNutritionalGuidanceSelectedPatient: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedNutritionalGuidanceSelectedPatient: null });
  },
}));