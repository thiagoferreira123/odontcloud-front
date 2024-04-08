import { create } from "zustand";

interface SendPDFModalStore {
  showModal: boolean;

  showModalSendPDF: () => void;
  closeModal: () => void;
}

export const useSendPDFModalStore = create<SendPDFModalStore>(set => ({
  selectedMeal: null,
  showModal: false,

  showModalSendPDF: () => set({ showModal: true }),
  closeModal: () => set({ showModal: false }),
}))