import { create } from "zustand";
import { ModalStore } from "./types";

import { useModalDeleteConfirmationActions } from "./ModalDeleteConfirmationActions";

export const useModalStore = create<ModalStore>((set) => ({
  showDeleteConfirmationModal: false,

  selectedExam: null,

  handleSelectExam: (recipe) => {
    set({ selectedExam: recipe, showDeleteConfirmationModal: true });
  },

  ...useModalDeleteConfirmationActions(set),
}));