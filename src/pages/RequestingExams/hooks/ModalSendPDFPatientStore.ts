import { create } from "zustand";

interface ModalSendPDFPatientStore {
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  setShowModalSendPDFPatient: (showModal: boolean) => void;
}

export const useModalSendPDFPatientStore = create<ModalSendPDFPatientStore>((set) => ({
  showModal: false,

  setShowModalSendPDFPatient: (showModal) => set({ showModal }),
}));