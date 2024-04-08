import { create } from "zustand";
import { ModalStore } from "./types";

import { useModalConfigurationActions } from "./ModalConfigurationActions";
import { useModalDeleteConfirmationActions } from "./ModalDeleteConfirmationActions";

export const useModalStore = create<ModalStore>((set) => ({
  showConfigurationModalRecipe: false,
  showDeleteConfirmationModal: false,

  selectedRecipe: null,

  handleSelectRecipe: (recipe) => {
    set({ selectedRecipe: recipe, showConfigurationModalRecipe: true });
  },

  ...useModalConfigurationActions(set),
  ...useModalDeleteConfirmationActions(set),
}));