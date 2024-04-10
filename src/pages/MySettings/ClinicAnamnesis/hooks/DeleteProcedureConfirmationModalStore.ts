import { create } from "zustand";
import { ClinicAnamnesis } from "./ClinicAnamnesisStore/types";

interface DeleteAnamnesisConfirmationModalStore {
  showModal: boolean;

  selectedClinicAnamnesis: ClinicAnamnesis | null;

  handleSelectClinicAnamnesisToRemove: (expenditure: ClinicAnamnesis) => void;
  hideModal: () => void;
}

export const useDeleteAnamnesisConfirmationModalStore = create<DeleteAnamnesisConfirmationModalStore>((set) => ({
  showModal: false,

  selectedClinicAnamnesis: null,

  handleSelectClinicAnamnesisToRemove(expenditure) {
    set({ selectedClinicAnamnesis: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedClinicAnamnesis: null });
  },
}));