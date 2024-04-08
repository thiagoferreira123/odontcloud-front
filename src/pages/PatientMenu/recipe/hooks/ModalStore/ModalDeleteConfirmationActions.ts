import { ModalDeleteConfirmationActions, ModalStore } from "./types";

// eslint-disable-next-line no-unused-vars
export const useModalDeleteConfirmationActions = (set: (partial: (state: ModalStore) => Partial<ModalStore>) => void) => (<ModalDeleteConfirmationActions>{
  hideDeleteConfirmationModal: () =>
    set(() => {
      return { showDeleteConfirmationModal: false };
    }),

  handleDeleteRecipe: (recipe) =>
    set(() => {
      return { selectedRecipe: recipe, showDeleteConfirmationModal: true };
    }),
})