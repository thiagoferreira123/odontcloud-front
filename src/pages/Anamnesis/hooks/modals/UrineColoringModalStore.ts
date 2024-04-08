import { create } from "zustand";

interface UrineColoringModalStore {
  showModal: boolean;

  hideModal: () => void;
  showUrineColoringModal: () => void;
}

export const useUrineColoringModalStore = create<UrineColoringModalStore>((set) => ({
  showModal: false,

  hideModal: () => {
    set({ showModal: false });
  },

  showUrineColoringModal: () => {
    set({ showModal: true });
  },
}));