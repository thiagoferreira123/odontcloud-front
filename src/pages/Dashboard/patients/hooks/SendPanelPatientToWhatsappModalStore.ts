import { create } from "zustand";
import { Patient } from "../../../../types/Patient";

interface SendPanelPatientToWhatsappModalStore {
  showModal: boolean;
  selectedPatient: Patient | null;

  hideModal: () => void;
  handleSelectPatientForPanelPatientModal: (patient: Patient) => void;
}

export const useSendPanelPatientToWhatsappModalStore = create<SendPanelPatientToWhatsappModalStore>((set) => ({
  showModal: false,
  selectedPatient: null,

  hideModal() {
    set({ showModal: false, selectedPatient: null });
  },

  handleSelectPatientForPanelPatientModal(patient) {
    set({ selectedPatient: patient, showModal: true});
  },
}));