import { create } from "zustand";
import { ITemplate } from "../TemplateStore";

interface DeleteTemplateConfirmationModalStore {
  showModal: boolean;

  selectedTemplate: ITemplate | null;

  // eslint-disable-next-line no-unused-vars
  handleDeleteTemplate: (selectedTemplate: ITemplate) => void;
  hideModal: () => void;
}

export const useDeleteTemplateConfirmationModalStore = create<DeleteTemplateConfirmationModalStore>((set) => ({
  showModal: false,

  selectedTemplate: null,

  handleDeleteTemplate: (selectedTemplate) => set({ selectedTemplate, showModal: true }),
  hideModal: () => set({ showModal: false }),
}));