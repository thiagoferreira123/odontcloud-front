import { Recipe } from "/src/types/ReceitaCulinaria";
import { create } from "zustand";

interface ModalDeleteConfirmationStore {
  showDeleteConfirmation: boolean;
  selectedRecipe: Recipe | null;

  // eslint-disable-next-line no-unused-vars
  setShowDeleteConfirmation: (showDeleteConfirmation: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedRecipe: (selectedRecipe: Recipe | null) => void;
}

export const useModalDeleteConfirmationStore = create<ModalDeleteConfirmationStore>((set) => ({
  showDeleteConfirmation: false,
  selectedRecipe: null,

  setShowDeleteConfirmation: (showDeleteConfirmation) => set({ showDeleteConfirmation }),
  setSelectedRecipe: (selectedRecipe) => set({ selectedRecipe }),
}));