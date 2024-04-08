import { create } from "zustand";
import { Secretary } from "../../../../hooks/professional/SecretaryStore";

interface DeleteConfirmationModalStore {
  showModal: boolean;
  selectedSecretary: Secretary | null;

  // eslint-disable-next-line no-unused-vars
  setDeleteSelectedSecretary: (location: Secretary) => void;
  handleCloseModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,
  selectedSecretary: null,

  setDeleteSelectedSecretary: (location) => set({ selectedSecretary: location, showModal: true }),
  handleCloseModal: () => set({ showModal: false, selectedSecretary: null }),
}));