import { create } from "zustand";
import { MetabolicTracking } from "./MetabolicTracking/types";

interface DeleteConfirmationStore {
  showModal: boolean;

  selectedMetabolicTracking: MetabolicTracking | null;

  handleSelectMetabolicTrackingToRemove: (expenditure: MetabolicTracking) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationStore = create<DeleteConfirmationStore>((set) => ({
  showModal: false,

  selectedMetabolicTracking: null,

  handleSelectMetabolicTrackingToRemove(expenditure) {
    set({ selectedMetabolicTracking: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedMetabolicTracking: null });
  },
}));