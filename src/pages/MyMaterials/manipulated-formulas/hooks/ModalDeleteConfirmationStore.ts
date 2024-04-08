import { create } from "zustand";
import { ITemplate } from "../../../ManipulatedFormulas/hooks/TemplateStore";

interface ModalDeleteConfirmationStore {
  selectedTemplate: ITemplate | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleDeleteTemplateConfirm: (tempalte: ITemplate) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedTemplate: (tempalte: ITemplate | null) => void;
  hideModal: () => void;
}

export const useModalDeleteConfirmationStore = create<ModalDeleteConfirmationStore>((set) => ({
  selectedTemplate: null,
  showModal: false,

  handleDeleteTemplateConfirm: (tempalte) => {
    set({ selectedTemplate: tempalte, showModal: true });
  },
  setSelectedTemplate: (tempalte) => {
    set({ selectedTemplate: tempalte });
  },

  hideModal: () => {
    set({ showModal: false });
  }
}));