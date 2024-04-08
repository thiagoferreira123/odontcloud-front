import api from "/src/services/useAxios";
import { RecipeHistoryRecipe, RecipeHistoryRecipeFood, RecipeHistoryRecipeMethodOfPreparation } from "/src/types/ReceitaCulinaria";
import { create } from "zustand";

interface EditReciptStore {
  selectedRecipe: RecipeHistoryRecipe | null;

  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleSelectRecipe: (recipe: RecipeHistoryRecipe) => void;

  // eslint-disable-next-line no-unused-vars
  updateSelectedRecipe(recipe: Partial<RecipeHistoryRecipe>): void;

  // eslint-disable-next-line no-unused-vars
  updateSelectedRecipeFood(food: Partial<RecipeHistoryRecipeFood>): void;

  // eslint-disable-next-line no-unused-vars
  updateSelectedRecipeFoodMacros(food: Partial<RecipeHistoryRecipeFood>): void;

  // eslint-disable-next-line no-unused-vars
  addSelectedRecipeFood: (food: RecipeHistoryRecipeFood) => void;

  // eslint-disable-next-line no-unused-vars
  removeSelectedRecipeFood: (food: RecipeHistoryRecipeFood) => Promise<void>;

  // eslint-disable-next-line no-unused-vars
  updateSelectedRecipePreparations: (preparations: RecipeHistoryRecipeMethodOfPreparation[]) => void;

  // eslint-disable-next-line no-unused-vars
  removeSelectedRecipePreparation: (preparation: RecipeHistoryRecipeMethodOfPreparation) => Promise<void>;

  hideModal: () => void;
}

export const useEditReciptStore = create<EditReciptStore>((set) => ({
  selectedRecipe: null,

  showModal: false,

  handleSelectRecipe: (recipe) => {
    set({ selectedRecipe: recipe, showModal: true });
  },

  updateSelectedRecipe: (recipe) => {
    set((state) => {
      if (!state.selectedRecipe) return state;
      const { selectedRecipe } = state;

      return { selectedRecipe: { ...selectedRecipe, ...recipe } };
    });
  },

  updateSelectedRecipeFood: (food) => {
    set((state) => {
      if (!state.selectedRecipe) return state;
      const { selectedRecipe } = state;

      const foodIndex = selectedRecipe.alimentos.findIndex((f) => f.id === food.id);

      selectedRecipe.alimentos[foodIndex] = { ...selectedRecipe.alimentos[foodIndex], ...food };

      return { selectedRecipe };
    });
  },

  updateSelectedRecipeFoodMacros: (food) => {
    set((state) => {
      if (!state.selectedRecipe) return state;

      const alimentos = state.selectedRecipe.alimentos.map((actualFood) => {
        if (actualFood.id === food.id) {

          if (!food.food || !food.measure) return actualFood;

          const gramas = food.measure.gramas * Number(food.quantidade);

          const payload = {
            gramas,
            carboidratos: Number(((Number(food.food?.carboidrato) * Number(gramas)) / 100).toFixed(1)),
            proteinas: Number(((Number(food.food?.proteina) * Number(gramas)) / 100).toFixed(1)),
            lipideos: Number(((Number(food.food?.lipideos) * Number(gramas)) / 100).toFixed(1)),
            kcal: Number(((Number(food.food?.energia) * Number(gramas)) / 100).toFixed(1)),
          };

          return { ...actualFood, ...payload };
        }
        return actualFood;
      });

      return { selectedRecipe: { ...state.selectedRecipe, alimentos } };
    });
  },

  addSelectedRecipeFood: (food) => {
    set((state) => {
      if (!state.selectedRecipe) return state;
      const { selectedRecipe } = state;

      selectedRecipe.alimentos.push(food);

      return { selectedRecipe };
    });
  },

  removeSelectedRecipeFood: async (food) => {
    set((state) => {
      if (!state.selectedRecipe) return state;
      const { selectedRecipe } = state;

      const alimentos = selectedRecipe.alimentos.filter((actualFood) => actualFood.id !== food.id);

      typeof food.id === 'number' && api.delete(`/receita-culinaria-historico-paciente-alimento/${food.id}`);

      return { selectedRecipe: { ...state.selectedRecipe, alimentos } };
    });
  },

  updateSelectedRecipePreparations: (preparos) => {
    set((state) => {
      if (!state.selectedRecipe) return state;
      const { selectedRecipe } = state;

      return { selectedRecipe: { ...selectedRecipe, preparos } };
    });
  },

  removeSelectedRecipePreparation: async (preparo) => {
    set((state) => {
      if (!state.selectedRecipe) return state;
      const { selectedRecipe } = state;

      const preparos = selectedRecipe.preparos.filter((actualPreparo) => actualPreparo.id !== preparo.id);

      typeof preparo.id === 'number' && api.delete(`/receita-culinaria-historico-paciente-modo-de-preparo/${preparo.id}`);

      return { selectedRecipe: { ...state.selectedRecipe, preparos } };
    });
  },

  hideModal: () => {
    set({ showModal: false });
  },
}));