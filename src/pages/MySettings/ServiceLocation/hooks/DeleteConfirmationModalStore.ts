import { create } from "zustand";
import { Local } from "../../../../types/Events";

interface DeleteConfirmationModalStore {
  showModal: boolean;
  selectedLocation: Local | null;

  // eslint-disable-next-line no-unused-vars
  setDeleteSelectedLocation: (location: Local) => void;
  handleCloseModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,
  selectedLocation: null,

  setDeleteSelectedLocation: (location) => set({ selectedLocation: location, showModal: true }),
  handleCloseModal: () => set({ showModal: false, selectedLocation: null }),
}));