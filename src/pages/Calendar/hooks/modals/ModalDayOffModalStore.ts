import { create } from "zustand";

interface ModalDayOffModalStore {
  showModal: boolean;

  openModalDayOffModal: () => void;
  hideModal: () => void;
}

export const useModalDayOffModalStore = create<ModalDayOffModalStore>((set) => ({
  showModal: false,

  openModalDayOffModal() {
    set({ showModal: true });
  },

  hideModal() {
    set({ showModal: false });
  },
}));