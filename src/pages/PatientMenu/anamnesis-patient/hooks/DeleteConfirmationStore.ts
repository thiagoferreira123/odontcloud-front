import { create } from "zustand";
import { Anamnesis } from "./AnamnesisStore/types";

interface DeleteConfirmationStore {
  showModal: boolean;

  selectedAnamnesis: Anamnesis | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectAnamnesisToRemove: (expenditure: Anamnesis) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationStore = create<DeleteConfirmationStore>((set) => ({
  showModal: false,

  selectedAnamnesis: null,

  handleSelectAnamnesisToRemove(expenditure) {
    set({ selectedAnamnesis: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedAnamnesis: null });
  },
}));