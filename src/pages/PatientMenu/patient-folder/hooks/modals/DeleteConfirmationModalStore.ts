import { create } from "zustand";
import { PatientFile } from "../types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedPatientFile: PatientFile | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectPatientFileToRemove: (expenditure: PatientFile) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedPatientFile: null,

  handleSelectPatientFileToRemove(expenditure) {
    set({ selectedPatientFile: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedPatientFile: null });
  },
}));