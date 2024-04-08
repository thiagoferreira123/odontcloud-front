import { create } from "zustand";
import { Patient } from "../../../../types/Patient";

interface DeleteConfirmStore {
  showModal: boolean;

  selectedPatient: Patient | null;

  // eslint-disable-next-line no-unused-vars
  handleDeletePatient: (patient: Patient) => void;
  handleCloseModal: () => void;
}

export const useDeleteConfirmStore = create<DeleteConfirmStore>((set) => ({
  showModal: false,
  selectedPatient: null,

  handleDeletePatient: (patient: Patient) => {
    set(() => ({ showModal: true, selectedPatient: patient }));
  },
  handleCloseModal: () => set(() => ({ showModal: false, selectedPatient: null })),
}));