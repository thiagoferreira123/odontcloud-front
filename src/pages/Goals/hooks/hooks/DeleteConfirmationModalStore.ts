import { create } from "zustand";
import { GoalsDetails } from "./GoalsDetailsStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedGoals: GoalsDetails | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectGoalsToRemove: (expenditure: GoalsDetails) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedGoals: null,

  handleSelectGoalsToRemove(expenditure) {
    set({ selectedGoals: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedGoals: null });
  },
}));