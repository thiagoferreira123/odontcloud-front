import { create } from "zustand";
import { ITemplate } from "../TemplateStore";

interface ModalAddFormulatedStore {
  showModal: boolean;
  selectedTemplate: ITemplate | null;

  // eslint-disable-next-line no-unused-vars
  showModalAddFormulated: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectTemplate: (selectedTemplate: ITemplate) => void;
  hideModal: () => void;
}

export const useModalAddFormulatedStore = create<ModalAddFormulatedStore>((set) => ({
  showModal: false,
  selectedTemplate: null,

  showModalAddFormulated: () => set({ showModal: true, selectedTemplate: null }),
  handleSelectTemplate: (selectedTemplate) => set({ selectedTemplate, showModal: true }),
  hideModal: () => set({ showModal: false, selectedTemplate: null }),
}));