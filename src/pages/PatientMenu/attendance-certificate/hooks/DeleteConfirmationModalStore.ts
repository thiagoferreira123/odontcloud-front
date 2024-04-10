import { create } from "zustand";
import { Certificate } from "./CertificateStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedCertificate: Certificate | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectCertificateToRemove: (expenditure: Certificate) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedCertificate: null,

  handleSelectCertificateToRemove(expenditure) {
    set({ selectedCertificate: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedCertificate: null });
  },
}));