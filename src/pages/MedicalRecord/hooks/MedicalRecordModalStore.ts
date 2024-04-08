import { create } from "zustand";
import { MedicalRecord } from "../../PatientMenu/medical-record/hooks/types";

interface MedicalRecordModalStore {
  showModal: boolean;

  selectedMedicalRecord: MedicalRecord | null;

  hideModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectMedicalRecordToEdit: (medicalRecord: MedicalRecord) => void;
}

export const useMedicalRecordModalStore = create<MedicalRecordModalStore>((set) => ({
  showModal: false,
  selectedMedicalRecord: null,

  hideModal: () => {
    set({ showModal: false, selectedMedicalRecord: null });
  },

  handleSelectMedicalRecordToEdit: (notricionalGuidance) => {
    set({ selectedMedicalRecord: notricionalGuidance, showModal: true });
  },
}));