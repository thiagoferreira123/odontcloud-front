import { create } from "zustand";
import { CarePlanBudget } from "./CarePlanBudgetStore/types";

interface ConfigModalStore {
  showModal: boolean;

  selectedCarePlanBudget: CarePlanBudget | null;

  hideConfigModal: () => void;
  handleSelectCarePlanBudget: (assessment: CarePlanBudget) => void;
  handleShowModal: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModal: false,
  selectedCarePlanBudget: null,

  hideConfigModal: () => {
    set({ showModal: false, selectedCarePlanBudget: null });
  },

  handleSelectCarePlanBudget: (assessment) => {
    set({ selectedCarePlanBudget: assessment, showModal: true });
  },

  handleShowModal: () => {
    set({ showModal: true, selectedCarePlanBudget: null });
  },
}));