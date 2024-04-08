import { create } from "zustand";

interface ModalHistoricStore {
  showModal: boolean;

  openModalHistoric: () => void;
  hideModal: () => void;
}

export const useModalHistoricStore = create<ModalHistoricStore>((set) => ({
  showModal: false,

  openModalHistoric() {
    set({ showModal: true });
  },

  hideModal() {
    set({ showModal: false });
  },
}));