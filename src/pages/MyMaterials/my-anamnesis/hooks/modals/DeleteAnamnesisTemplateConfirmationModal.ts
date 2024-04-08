import { create } from "zustand";
import { AnamnesisTemplate } from "../../../../Anamnesis/hooks/AnamnesisTemplateStore";

interface DeleteAnamnesisTemplateConfirmationModalStore {
  selectedTemplate: AnamnesisTemplate | null;
  showModal: boolean;

  handleSelectAnamnesisToDelete: (template: AnamnesisTemplate) => void;
  closeModal: () => void;
}

export const useDeleteAnamnesisTemplateConfirmationModal = create<DeleteAnamnesisTemplateConfirmationModalStore>(set => ({
  selectedTemplate: null,
  showModal: false,

  handleSelectAnamnesisToDelete: (selectedTemplate) => set({ selectedTemplate, showModal: true }),
  closeModal: () => set({ showModal: false, selectedTemplate: null }),
}))