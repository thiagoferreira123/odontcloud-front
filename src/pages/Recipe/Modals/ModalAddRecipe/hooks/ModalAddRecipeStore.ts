import { MultiValue } from "react-select";
import api from "/src/services/useAxios";
import { Recipe, RecipeCategory, RecipeHistoryRecipeFood, RecipeHistoryRecipeMethodOfPreparation } from "/src/types/ReceitaCulinaria";
import { Option } from "/src/types/inputs";
import { create } from "zustand";

interface ModalAddRecipe {
  showModal: boolean;
  categories: RecipeCategory[];
  selectedCategories: Option[];
  foods: RecipeHistoryRecipeFood[];
  preparations: RecipeHistoryRecipeMethodOfPreparation[];

  // eslint-disable-next-line no-unused-vars
  setShowModalAddRecipe: (showModal: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectRecipe: (recipe: Recipe) => void;
  getCategories: () => Promise<RecipeCategory[]>;
  // eslint-disable-next-line no-unused-vars
  setSelectedCategories: (selectedCategories: MultiValue<Option>) => void;

  // eslint-disable-next-line no-unused-vars
  addFood: (food: RecipeHistoryRecipeFood) => void;
  // eslint-disable-next-line no-unused-vars
  updateFood: (food: Partial<RecipeHistoryRecipeFood>) => void;
  // eslint-disable-next-line no-unused-vars
  updateFoodMacros: (food: Partial<RecipeHistoryRecipeFood>) => void;
  // eslint-disable-next-line no-unused-vars
  removeFood: (food: RecipeHistoryRecipeFood) => void;

  // eslint-disable-next-line no-unused-vars
  updatePreparations: (preparations:RecipeHistoryRecipeMethodOfPreparation[]) => void;
  // eslint-disable-next-line no-unused-vars
  removePreparation: (preparation: RecipeHistoryRecipeMethodOfPreparation) => void;
  // eslint-disable-next-line no-unused-vars
  addPreparation: (preparation: RecipeHistoryRecipeMethodOfPreparation) => void;
}

export const useModalAddRecipeStore = create<ModalAddRecipe>((set) => ({
  showModal: false,
  categories: [],
  selectedCategories: [],
  foods: [],
  preparations: [],

  setShowModalAddRecipe: (showModal) => set({ showModal }),

  handleSelectRecipe: (recipe) => {
    set(() => {
      return {
        foods: recipe.alimentos,
        preparations: recipe.preparos,
      }
    });

    set(() => {
      return {
        showModal: true,
      }
    });
  },

  getCategories: async () => {
    const { data } = await api.get<RecipeCategory[]>('/receita-culinaria-diet-system-categoria-descricao/profissional');

    set({ categories: data });

    return data;
  },
  setSelectedCategories: (selectedCategories) => set({selectedCategories: [...selectedCategories]}),

  addFood: (food) => set(state => {return { foods: [...state.foods, food] }}),
  updateFood: (food) => set(state => {
    const foods = state.foods.map(f => {
      if (f.id === food.id) return { ...f, ...food };
      return f;
    });

    return { foods };
  }),
  removeFood: (food) => set(state => {
    const foods = state.foods.filter(f => f.id !== food.id);

    if(typeof food.id === 'number') api.delete(`/receita-culinaria-diet-system-alimento/${food.id}`);

    return { foods };
  }),

  updateFoodMacros: (food) => {
    set((state) => {
      const foods = state.foods.map((actualFood) => {
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

      return { foods };
    });
  },

  updatePreparations: (preparations) => set(() => {
    return { preparations };
  }),

  removePreparation: (preparation) => set(state => {
    const preparations = state.preparations.filter(p => p.id !== preparation.id);

    if(typeof preparation.id === 'number') api.delete(`/receita-culinaria-diet-system-modo-de-preparo/${preparation.id}`);

    return { preparations };
  }),

  addPreparation: (preparation) => set(state => {
    const preparations = [...state.preparations, preparation];

    return { preparations };
  }),
}));