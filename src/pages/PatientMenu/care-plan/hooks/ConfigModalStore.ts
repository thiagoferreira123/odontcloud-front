import { create } from "zustand";
import { CarePlan } from "./CarePlanStore/types";

interface ConfigModalStore {
  showModal: boolean;

  selectedCarePlan: CarePlan | null;

  hideConfigModal: () => void;
  handleSelectCarePlan: (assessment: CarePlan) => void;
  handleShowModal: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedCarePlan: null,

  hideConfigModal: () => {
    set({ showModal: false, selectedCarePlan: null });
  },

  handleSelectCarePlan: (assessment) => {
    set({ selectedCarePlan: assessment, showModal: true });
  },

  handleShowModal: () => {
    set({ showModal: true, selectedCarePlan: null });
  },
}));