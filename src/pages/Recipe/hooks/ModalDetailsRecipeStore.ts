import { Recipe } from "/src/types/ReceitaCulinaria";
import { create } from "zustand";

interface ModalDetailsRecipeStore {
  showModalDetailsRecipe: boolean;
  selectedRecipe: Recipe | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectRecipeDetails: (recipe: Recipe) => void;
  hideModalDetailsRecipe: () => void;
}

export const useModalDetailsRecipeStore = create<ModalDetailsRecipeStore>((set) => ({
  showModalDetailsRecipe: false,
  selectedRecipe: null,

  handleSelectRecipeDetails: (recipe) => set(() => ({ showModalDetailsRecipe: true, selectedRecipe: recipe })),
  hideModalDetailsRecipe: () => set(() => ({ showModalDetailsRecipe: false, selectedRecipe: null })),
}));