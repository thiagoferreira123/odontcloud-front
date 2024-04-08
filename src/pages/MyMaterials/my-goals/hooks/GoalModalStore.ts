import { create } from "zustand";
import { GoalTemplate } from "../../../PatientMenu/goals/hooks/GoalTemplateStore/types";

interface GoalModalStore {
  selectedGoal: GoalTemplate | null;
  showModal: boolean;

  handleSelectGoal: (meal: GoalTemplate) => void;
  showGoalModal: () => void;
  hideModal: () => void;
}

export const useGoalModalStore = create<GoalModalStore>(set => ({
  selectedGoal: null,
  showModal: false,

  handleSelectGoal: (selectedGoal) => set({ selectedGoal, showModal: true }),
  showGoalModal: () => set({ showModal: true, selectedGoal: null }),
  hideModal: () => set({ showModal: false, selectedGoal: null }),
}))