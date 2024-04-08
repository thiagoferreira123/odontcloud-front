import { create } from "zustand";
import { GoalTemplate } from "../../../PatientMenu/goals/hooks/GoalTemplateStore/types";

interface DeleteGoalTemplateConfirmationModalStore {
  selectedTemplate: GoalTemplate | null;
  showModal: boolean;

  handleSelectGoalToDelete: (template: GoalTemplate) => void;
  closeModal: () => void;
}

export const useDeleteGoalTemplateConfirmationModalStore = create<DeleteGoalTemplateConfirmationModalStore>(set => ({
  selectedTemplate: null,
  showModal: false,

  handleSelectGoalToDelete: (selectedTemplate) => set({ selectedTemplate, showModal: true }),
  closeModal: () => set({ showModal: false, selectedTemplate: null }),
}))