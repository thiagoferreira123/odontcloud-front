import { create } from "zustand";

interface ModalSendPDFLabStore {
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  setShowModalSendPDFLab: (showModal: boolean) => void;
}

export const useModalSendPDFLabStore = create<ModalSendPDFLabStore>((set) => ({
  showModal: false,

  setShowModalSendPDFLab: (showModal) => set({ showModal }),
}));