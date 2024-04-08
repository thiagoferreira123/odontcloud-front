import { create } from "zustand";

interface ModalSendPDFPharmacyStore {
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  setShowModalSendPDFPharmacy: (showModal: boolean) => void;
}

export const useModalSendPDFPharmacyStore = create<ModalSendPDFPharmacyStore>((set) => ({
  showModal: false,

  setShowModalSendPDFPharmacy: (showModal) => set({ showModal }),
}));