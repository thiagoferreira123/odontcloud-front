import { create } from "zustand";
import { MedicalRecord } from "./types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedMedicalRecord: MedicalRecord | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectMedicalRecordToRemove: (expenditure: MedicalRecord) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedMedicalRecord: null,

  handleSelectMedicalRecordToRemove(expenditure) {
    set({ selectedMedicalRecord: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedMedicalRecord: null });
  },
}));