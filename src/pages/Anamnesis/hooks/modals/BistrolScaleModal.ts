import { create } from "zustand";

interface BistrolScaleModalStore {
  showModal: boolean;

  hideModal: () => void;
  showBistrolScaleModal: () => void;
}

export const useBistrolScaleModalStore = create<BistrolScaleModalStore>((set) => ({
  showModal: false,

  hideModal: () => {
    set({ showModal: false });
  },

  showBistrolScaleModal: () => {
    set({ showModal: true });
  },
}));