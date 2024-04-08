import { ModalDeleteConfirmationActions, ModalStore } from "./types";

// eslint-disable-next-line no-unused-vars
export const useModalDeleteConfirmationActions = (set: (partial: (state: ModalStore) => Partial<ModalStore>) => void) => (<ModalDeleteConfirmationActions>{
  hideDeleteConfirmationModal: () =>
    set(() => {
      return { showDeleteConfirmationModal: false };
    }),

  handleDeleteExam: (recipe) =>
    set(() => {
      return { selectedExam: recipe, showDeleteConfirmationModal: true };
    }),
})