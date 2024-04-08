import { ClassicPlanStore, MealActions } from "./types";

// eslint-disable-next-line no-unused-vars
const useMealActions = (set: (partial: (state: ClassicPlanStore) => Partial<ClassicPlanStore>) => void) => (<MealActions>{
  setMeals: (meals) =>
    set(() => {
      return { meals: meals };
    }),

  addMeal: (meal) =>
    set((state) => {
      return { meals: [...state.meals, meal] };
    }),

  removeMeal: (meal) =>
    set((state) => {
      return { meals: state.meals.filter((m) => m.id !== meal.id) };
    }),

  updateMeal: (meal) => {    
    set((state) => {
      const meals = state.meals.map((m) => {
        if (m.id === meal.id) {
          return { ...m, ...meal };
        }
        return m;
      });

      return { meals: meals };
    });
  },
})

export default useMealActions;