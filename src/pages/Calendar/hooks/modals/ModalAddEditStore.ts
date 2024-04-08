import { create } from "zustand";

interface ModalAddEditStore {
  showModal: boolean;

  openModalAddEdit: () => void;
  hideModal: () => void;
}

export const useModalAddEditStore = create<ModalAddEditStore>((set) => ({
  showModal: false,

  openModalAddEdit() {
    set({ showModal: true });
  },

  hideModal() {
    set({ showModal: false });
  },
}));