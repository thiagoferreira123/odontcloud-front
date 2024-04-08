import { create } from "zustand";
import { NutritionalGuidanceSelectedPatient } from "../../PatientMenu/nutritional-guidance/hooks/types";

interface NutritionalGuidanceModal {
  showModal: boolean;

  selectedNutritionalGuidanceSelectedPatient: NutritionalGuidanceSelectedPatient | null;

  hideModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectNutritionalGuidanceToEdit: (notricionalGuidance: NutritionalGuidanceSelectedPatient) => void;
  // eslint-disable-next-line no-unused-vars
  handleUpdateNutritionalGuidanceSelectedPatient: (notricionalGuidance: NutritionalGuidanceSelectedPatient) => void;
}

export const useNutritionalGuidanceModalStore = create<NutritionalGuidanceModal>((set) => ({
  showModal: false,
  selectedNutritionalGuidanceSelectedPatient: null,

  hideModal: () => {
    set({ showModal: false, selectedNutritionalGuidanceSelectedPatient: null });
  },

  handleSelectNutritionalGuidanceToEdit: (notricionalGuidance) => {
    set({ selectedNutritionalGuidanceSelectedPatient: notricionalGuidance, showModal: true });
  },
  handleUpdateNutritionalGuidanceSelectedPatient: (notricionalGuidance) => {
    set({ selectedNutritionalGuidanceSelectedPatient: notricionalGuidance });
  },
}));