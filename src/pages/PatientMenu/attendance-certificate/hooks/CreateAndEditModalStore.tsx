import { create } from "zustand";
import { CertificateDetails } from "./CertificateStore/types";

interface CreateAndEditModalStore {
  showModal: boolean;

  selectedCertificate: CertificateDetails | null;

  handleSelectCertificateToEdit: (expenditure: CertificateDetails) => void;
  openModal: () => void;
  hideModal: () => void;
}

export const useCreateAndEditModalStore = create<CreateAndEditModalStore>((set) => ({
  showModal: false,

  selectedCertificate: null,

  handleSelectCertificateToEdit(expenditure) {
    set({ selectedCertificate: expenditure, showModal: true });
  },

  openModal() {
    set({ showModal: true, selectedCertificate: null });
  },

  hideModal() {
    set({ showModal: false, selectedCertificate: null });
  },
}));