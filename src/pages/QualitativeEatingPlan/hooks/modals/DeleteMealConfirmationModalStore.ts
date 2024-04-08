import { create } from "zustand";
import { TemplateMeal } from "../TemplateMealStore";

interface DeleteTemplateConfirmationModalStore {
  showModal: boolean;

  selectedTemplateMeal: TemplateMeal | null;

  // eslint-disable-next-line no-unused-vars
  handleDeleteTemplateMeal: (selectedTemplateMeal: TemplateMeal) => void;
  hideModal: () => void;
}

export const useDeleteTemplateConfirmationModalStore = create<DeleteTemplateConfirmationModalStore>((set) => ({
  showModal: false,

  selectedTemplateMeal: null,

  handleDeleteTemplateMeal: (selectedTemplateMeal) => set({ selectedTemplateMeal, showModal: true }),
  hideModal: () => set({ showModal: false }),
}));