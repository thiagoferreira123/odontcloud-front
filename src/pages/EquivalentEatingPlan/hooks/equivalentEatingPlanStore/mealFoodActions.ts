import { initialAmounts } from ".";
import { MealFoodActions, createEquivalentEatingPlanStore } from "./types";

const useMealFoodActions = (
  set: (partial: (state: createEquivalentEatingPlanStore) => Partial<createEquivalentEatingPlanStore>, replace?: boolean, name?: string) => void
) => (<MealFoodActions>{
  addMealFood: (food) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === food.id_refeicao) {
          meal.alimentos.push(food);

          return { ...meal };
        }
        return meal;
      });

      return { meals: meals };
    });
  },

  updateMealFood: (food, id) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === food.id_refeicao) {
          meal.alimentos = meal.alimentos.map((actualFood) => {
            if (id ? actualFood.id === id : actualFood.id === food.id) {
              return { ...actualFood, ...food };
            }
            return actualFood;
          });

          return { ...meal };
        }
        return meal;
      });

      return { meals: meals };
    });
  },

  removeMealFood: (food) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === food.id_refeicao) {
          meal.alimentos = meal.alimentos.filter((actualFood) => actualFood.id !== food.id);

          return { ...meal };
        }
        return meal;
      });

      return { meals: meals };
    });
  },

  removeMealsFoods: () => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        meal.alimentos = [];

        return { ...meal, amounts: initialAmounts };
      });

      return { meals: meals };
    });
  },
})

export default useMealFoodActions;