import { create } from "zustand";
import { Goal } from "./GoalStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedGoal: Goal | null;

  handleSelectGoalToRemove: (expenditure: Goal) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedGoal: null,

  handleSelectGoalToRemove(expenditure) {
    set({ selectedGoal: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedGoal: null });
  },
}));