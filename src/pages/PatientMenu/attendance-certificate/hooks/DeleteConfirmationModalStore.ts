import { create } from "zustand";
import { CertificateDetails } from "./CertificateStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedCertificate: CertificateDetails | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectCertificateToRemove: (expenditure: CertificateDetails) => void;
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