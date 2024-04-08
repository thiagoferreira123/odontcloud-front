import { CreateModalStore, SelectedMealActions } from "./types";

export const useSelectedMealActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<SelectedMealActions>{
  updateSelectedMealFood: (food) => {
    set((state) => {
      if (!state.selectedMeal) return state;

      const alimentos = state.selectedMeal.alimentos.map((actualFood) => {
        if (actualFood.id === food.id) {
          return { ...actualFood, ...food };
        }
        return actualFood;
      });

      return { selectedMeal: { ...state.selectedMeal, alimentos } };
    });
  },

  updateSelectedMealFoodMacros: (food) => {
    set((state) => {
      if (!state.selectedMeal) return state;

      const alimentos = state.selectedMeal.alimentos.map((actualFood) => {
        if (actualFood.id === food.id) {

          if(!food.food || !food.measure) return actualFood;

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

      return { selectedMeal: { ...state.selectedMeal, alimentos } };
    });
  },

  addSelectedMealFood: (food) => {
    set((state) => {
      if (!state.selectedMeal) return state;

      return { selectedMeal: { ...state.selectedMeal, alimentos: [...state.selectedMeal.alimentos, food] } };
    });
  },
})