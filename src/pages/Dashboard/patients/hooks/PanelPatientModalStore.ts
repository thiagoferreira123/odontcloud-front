import { create } from "zustand";
import { Patient } from "../../../../types/Patient";

interface PanelPatientModalStore {
  showModal: boolean;
  selectedPatient: Patient | null;

  hideModal: () => void;
  handleSelectPatientForPanelPatientModal: (patient: Patient) => void;
}

export const usePanelPatientModalStore = create<PanelPatientModalStore>((set) => ({
  showModal: false,
  selectedPatient: null,

  hideModal() {
    set({ showModal: false, selectedPatient: null });
  },

  handleSelectPatientForPanelPatientModal(patient) {
    set({ selectedPatient: patient, showModal: true});
  },
}));