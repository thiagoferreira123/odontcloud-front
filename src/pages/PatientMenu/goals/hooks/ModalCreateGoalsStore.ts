import { create } from "zustand";
import { Goal } from "./GoalStore/types";

interface CreateGoalModalStore {
  showModal: boolean;

  selectedGoal: Goal | null;

  hideModal: () => void;
  handleSelectGoal: (assessment: Goal) => void;
  handleShowCreateGoalModal: () => void;
}

export const useCreateGoalModalStore = create<CreateGoalModalStore>((set) => ({
  showModal: false,
  selectedGoal: null,

  hideModal: () => {
    set({ showModal: false, selectedGoal: null });
  },

  handleSelectGoal: (assessment) => {
    set({ selectedGoal: assessment, showModal: true });
  },

  handleShowCreateGoalModal: () => {
    set({ showModal: true, selectedGoal: null });
  },
}));