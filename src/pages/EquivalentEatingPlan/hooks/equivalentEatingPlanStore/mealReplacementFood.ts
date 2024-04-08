import { MealReplacementFoodActions, createEquivalentEatingPlanStore } from "./types";

const useMealReplacementFoodActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: createEquivalentEatingPlanStore) => Partial<createEquivalentEatingPlanStore>, replace?: boolean, name?: string) => void
) => (<MealReplacementFoodActions>{
  addMealReplacementFood: (food) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === food.idRefeicao) {
          meal.alimentosSubstitutos.push(food);

          return { ...meal };
        }
        return meal;
      });

      return { meals: meals };
    });
  },

  updateMealReplacementFood: (food) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === food.idRefeicao) {
          meal.alimentosSubstitutos = meal.alimentosSubstitutos.map((actualFood) => {
            if (actualFood.id === food.id) {
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

  removeMealReplacementFood: (food) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === food.idRefeicao) {
          meal.alimentosSubstitutos = meal.alimentosSubstitutos.filter((actualFood) => actualFood.id !== food.id);

          return { ...meal };
        }
        return meal;
      });

      return { meals: meals };
    });
  },
})

export default useMealReplacementFoodActions;