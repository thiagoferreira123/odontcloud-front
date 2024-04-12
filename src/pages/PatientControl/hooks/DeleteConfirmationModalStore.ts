import { create } from "zustand";
import { PatientControlDetails } from "./PatientControlStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedPatientControl: PatientControlDetails | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectPatientControlToRemove: (expenditure: PatientControlDetails) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedPatientControl: null,

  handleSelectPatientControlToRemove(expenditure) {
    set({ selectedPatientControl: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedPatientControl: null });
  },
}));