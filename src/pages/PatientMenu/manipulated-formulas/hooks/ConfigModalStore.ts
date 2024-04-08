import { create } from "zustand";
import { ManipulatedFormula } from ".";

interface ConfigModalStore {
  showModalConfig: boolean;
  selectedManipulatedFormula: ManipulatedFormula | null;
  // eslint-disable-next-line no-unused-vars
  setShowModalConfig: (show: boolean) => void;
  hideConfigModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectManipulatedFormula: (expenditure: ManipulatedFormula | null) => void;
  clearSelectedManipulatedFormula: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModalConfig: false,
  selectedManipulatedFormula: null,

  setShowModalConfig: (show) => set({ showModalConfig: show }),
  hideConfigModal: () => set({ showModalConfig: false, selectedManipulatedFormula: null }),

  handleSelectManipulatedFormula: (expenditure) => set({ selectedManipulatedFormula: expenditure, showModalConfig: true }),
  clearSelectedManipulatedFormula: () => set({ selectedManipulatedFormula: null }),
}));