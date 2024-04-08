import { create } from "zustand";
import { HydrationAlert } from "./HydrationAlertDetailsStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedHydration: HydrationAlert | null;

  handleSelectHydrationToRemove: (expenditure: HydrationAlert) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedHydration: null,

  handleSelectHydrationToRemove(expenditure) {
    set({ selectedHydration: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedHydration: null });
  },
}));