import api from "/src/services/useAxios";
import {  RecipeHistory } from "/src/types/ReceitaCulinaria";
import { create } from "zustand";

interface RecipeStore {
  recipes: RecipeHistory[];
  query: string;

  // eslint-disable-next-line no-unused-vars
  getRecipes: (patientId: number) => Promise<RecipeHistory[]>;
  // eslint-disable-next-line no-unused-vars
  updateRecipe: (recipe: RecipeHistory) => void;
  // eslint-disable-next-line no-unused-vars
  addRecipe: (recipe: RecipeHistory) => void;
  // eslint-disable-next-line no-unused-vars
  removeRecipe: (recipeId: number) => void;
  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  recipes: [],
  query: "",

  getRecipes: async (patientId) => {
    const { data } = await api.get("/receita-culinaria-historico/paciente/"+ patientId);

    set({ recipes: data });

    return data;
  },
  updateRecipe: (recipe) => {
    set((state) => ({
      recipes: [...state.recipes, recipe],
    }));
  },
  addRecipe: (recipe) => {
    set((state) => ({
      recipes: [...state.recipes, recipe],
    }));
  },
  removeRecipe: (recipeId) => {
    set((state) => ({
      recipes: state.recipes.filter((recipe) => recipe.id !== recipeId),
    }));

    api.delete("/receita-culinaria-historico/" + recipeId);
  },
  setQuery: (query) => {
    set({ query });
  },
}));