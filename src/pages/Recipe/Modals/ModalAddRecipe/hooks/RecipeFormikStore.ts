import { Recipe } from "/src/types/ReceitaCulinaria";
import { create } from "zustand";

interface RecipeFormikStore {
  recipe: Recipe | null;

  // eslint-disable-next-line no-unused-vars
  setRecipe: (recipe: Recipe) => void;
}

export const useRecipeFormikStore = create<RecipeFormikStore>((set) => ({
  recipe: null,

  setRecipe: (recipe) => set({ recipe }),
}));