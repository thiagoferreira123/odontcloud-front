import { create } from "zustand";
import { ClassicPlanMealTemplate } from "../../../../types/PlanoAlimentarClassico";
import api from "../../../../services/useAxios";

interface MealStore {
  query: string;
  meals: ClassicPlanMealTemplate[];

  setQuery: (query: string) => void;
  getMeals: () => Promise<ClassicPlanMealTemplate[]>;
  setMeals: (meals: ClassicPlanMealTemplate[]) => void;
  addMeal: (meal: ClassicPlanMealTemplate) => void;
  updateMeal: (meal: ClassicPlanMealTemplate) => void;
  removeMeal: (id: number) => Promise<void>;
}

export const useMealStore = create<MealStore>((set) => ({
  query: '',
  meals: [],

  setQuery: (query) => set({ query }),

  getMeals: async () => {
    const { data } = await api.get('/plano-alimentar-classico-refeicao-modelo');

    set({ meals: data });

    return data;
  },

  setMeals: (meals) => set({ meals }),

  addMeal: (meal) => set((state) => ({ meals: [meal, ...state.meals] })),

  updateMeal: (meal) => {
    set((state) => {
      const index = state.meals.findIndex((m) => m.id == meal.id);

      if (index == -1) return state;

      state.meals[index] = meal;

      return { meals: [...state.meals] };
    });
  },

  removeMeal: async (id) => {
    await api.delete('/plano-alimentar-classico-refeicao-modelo/' + id);

    set((state) => ({ meals: state.meals.filter((meal) => meal.id != id) }))
  },
}));