import { create } from "zustand";
import { CaloricExpenditure } from "../../../../types/CaloricExpenditure";

interface ConfigModalStore {
  showModalConfig: boolean;
  selectedExpenditure: CaloricExpenditure | null;
  // eslint-disable-next-line no-unused-vars
  setShowModalConfig: (show: boolean) => void;
  hideConfigModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectExpenditure: (expenditure: CaloricExpenditure | null) => void;
  clearSelectedExpenditure: () => void;
}

export const useConfigModalStore = create<ConfigModalStore>((set) => ({
  showModalConfig: false,
  selectedExpenditure: null,

  setShowModalConfig: (show) => set({ showModalConfig: show }),
  hideConfigModal: () => set({ showModalConfig: false, selectedExpenditure: null }),

  handleSelectExpenditure: (expenditure) => set({ selectedExpenditure: expenditure, showModalConfig: true }),
  clearSelectedExpenditure: () => set({ selectedExpenditure: null }),
}));