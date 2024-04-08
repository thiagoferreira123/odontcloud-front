import api from "/src/services/useAxios";
import { Recipe } from "/src/types/ReceitaCulinaria";
import { create } from "zustand";

interface MyRecipesStore {
  recipes: Recipe[];
  query: string;

  getRecipes: () => Promise<Recipe[]>;

  // eslint-disable-next-line no-unused-vars
  removeRecipe: (recipe: Recipe) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  updateRecipe: (recipe: Recipe) => void;
  // eslint-disable-next-line no-unused-vars
  addRecipe: (recipe: Recipe) => void;

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
}

export const useMyRecipesStore = create<MyRecipesStore>((set) => ({
  recipes: [],
  query: '',

  getRecipes: async () => {
    const { data } = await api.get<Recipe[]>("/receita-culinaria-diet-system/professional");

    set({ recipes: data });

    return data;
  },

  removeRecipe: async (recipe) => {
    set((state) => ({
      recipes: state.recipes.filter((r) => r.id !== recipe.id),
    }));

    await api.delete(`/receita-culinaria-diet-system/${recipe.id}`);
  },

  updateRecipe: (recipe) => {
    set((state) => ({
      recipes: state.recipes.map((r) => (r.id === recipe.id ? recipe : r)),
    }));
  },

  addRecipe: (recipe) => {
    set((state) => ({
      recipes: [recipe, ...state.recipes],
    }));
  },

  setQuery: (query) => set({ query }),
}));