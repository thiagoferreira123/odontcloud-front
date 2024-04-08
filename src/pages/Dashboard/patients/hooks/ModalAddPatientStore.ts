import { create } from "zustand";
import { Patient } from "../../../../types/Patient";

interface createModalAddPatientStore {
  showModal: boolean;
  selectedPatient: Patient | null;

  handleOpenModal: () => void;
  handleCloseModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectPatient: (patient: Patient) => void;
}

export const useModalAddPatientStore = create<createModalAddPatientStore>((set) => ({
  showModal: false,
  selectedPatient: null,

  handleOpenModal() {
    set({ showModal: true, selectedPatient: null });
  },

  handleCloseModal() {
    set({ showModal: false, selectedPatient: null });
  },

  handleSelectPatient(patient) {
    set({ selectedPatient: patient, showModal: true});
  },
}));