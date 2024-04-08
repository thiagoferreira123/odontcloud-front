import { create } from "zustand";
import { ChecklistConductTemplate } from "../../../PatientMenu/checklist-conduct/hooks/ChecklistConductTemplatesStore/types";

interface DeleteChecklistConductTemplateConfirmationModalStore {
  selectedTemplate: ChecklistConductTemplate | null;
  showModal: boolean;

  handleSelectChecklistConductTemplateToDelete: (template: ChecklistConductTemplate) => void;
  closeModal: () => void;
}

export const useDeleteChecklistConductTemplateConfirmationModalStore = create<DeleteChecklistConductTemplateConfirmationModalStore>(set => ({
  selectedTemplate: null,
  showModal: false,

  handleSelectChecklistConductTemplateToDelete: (selectedTemplate) => set({ selectedTemplate, showModal: true }),
  closeModal: () => set({ showModal: false, selectedTemplate: null }),
}))