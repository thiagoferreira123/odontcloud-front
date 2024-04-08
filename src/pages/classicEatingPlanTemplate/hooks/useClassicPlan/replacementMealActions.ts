import { ClassicPlanStore, ReplacementMealActions } from "./types";

// eslint-disable-next-line no-unused-vars
const useReplacementMealActions = (set: (partial: (state: ClassicPlanStore) => Partial<ClassicPlanStore>, replace?: boolean, name?: string) => void) => (<ReplacementMealActions>{
  addReplacementMeal: (replacementMeal) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === replacementMeal.id_refeicao) {
          meal.substituicoes.push(replacementMeal);

          return { ...meal };
        }
        return meal;
      });

      return { meals: meals };
    });
  },

  updateReplacementMeal: (replacementMeal) => {
    set((state) => {
      const meals = state.meals.map((m) => {
        if (m.id === replacementMeal.id_refeicao) {
          const substituicoes = m.substituicoes.map((s) => {
            if (s.id === replacementMeal.id) {
              return { ...s, ...replacementMeal };
            }
            return s;
          });

          return { ...m, substituicoes };
        }
        return m;
      });

      return { meals: meals };
    });
  },

  removeReplacementMeal: (replacementMeal) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === replacementMeal.id_refeicao) {
          const substituicoes = meal.substituicoes.filter((s) => s.id !== replacementMeal.id);

          return { ...meal, substituicoes };
        }
        return meal;
      });

      return { meals: meals };
    });
  },
})

export default useReplacementMealActions;