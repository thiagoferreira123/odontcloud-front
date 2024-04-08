import { create } from "zustand";

interface SendPdfModalStore {
  showModal: boolean;

  hideModal: () => void;
  showSendPdfModalStore: () => void;
}

export const useSendPdfModalStore = create<SendPdfModalStore>((set) => ({
  showModal: false,

  hideModal: () => {
    set({ showModal: false });
  },

  showSendPdfModalStore: () => {
    set({ showModal: true });
  },
}));