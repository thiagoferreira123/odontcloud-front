import { create } from "zustand";

interface ModalSendPDFStore {
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  setShowModalSendPdfEmail: (showModal: boolean) => void;
}

export const useModalSendPDFStore = create<ModalSendPDFStore>((set) => ({
  showModal: false,

  setShowModalSendPdfEmail: (showModal) => set({ showModal }),
}));