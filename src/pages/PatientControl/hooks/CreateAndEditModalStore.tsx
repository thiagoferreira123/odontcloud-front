import { create } from "zustand";
import { PatientControlDetails } from "./PatientControlDetailsStore/types";

interface CreateAndEditModalStore {
  showModal: boolean;

  selectedPatientControl: PatientControlDetails | null;

  handleSelectPatientControlToEdit: (expenditure: PatientControlDetails) => void;
  openModal: () => void;
  hideModal: () => void;
}

export const useCreateAndEditModalStore = create<CreateAndEditModalStore>((set) => ({
  showModal: false,

  selectedPatientControl: null,

  handleSelectPatientControlToEdit(expenditure) {
    set({ selectedPatientControl: expenditure, showModal: true });
  },

  openModal() {
    set({ showModal: true, selectedPatientControl: null });
  },

  hideModal() {
    set({ showModal: false, selectedPatientControl: null });
  },
}));