import { create } from "zustand";

interface StoolColoringModalStore {
  showModal: boolean;

  hideModal: () => void;
  showStoolColoringModal: () => void;
}

export const useStoolColoringModalStore = create<StoolColoringModalStore>((set) => ({
  showModal: false,

  hideModal: () => {
    set({ showModal: false });
  },

  showStoolColoringModal: () => {
    set({ showModal: true });
  },
}));