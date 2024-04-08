import { create } from "zustand";

interface ModalWaitingListStore {
  showModal: boolean;

  openModalWaitingList: () => void;
  hideModal: () => void;
}

export const useModalWaitingListStore = create<ModalWaitingListStore>((set) => ({
  showModal: false,

  openModalWaitingList() {
    set({ showModal: true });
  },

  hideModal() {
    set({ showModal: false });
  },
}));