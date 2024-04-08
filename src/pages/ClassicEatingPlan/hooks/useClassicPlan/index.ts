import { create } from 'zustand';
import { ClassicPlanStore } from './types';
import useMealActions from './mealActions';
import useMealFoodActions from './mealFoodActions';
import useReplacementMealActions from './replacementMealActions';
import useReplacementMealFoodActions from './replacementMealFoodActions';
import { ClassicPlanMeal } from '/src/types/PlanoAlimentarClassico';

const sortMealsAndFoods = (meals: ClassicPlanMeal[]) => {
  meals.sort((a, b) => {
    const posicaoA = a.ordens.length ? a.ordens[0].posicao : 0;
    const posicaoB = b.ordens.length ? b.ordens[0].posicao : 0;
    return posicaoA - posicaoB;
  });

  meals.forEach(meal => {
    if (meal.alimentos && meal.alimentos.length > 0) {
      meal.alimentos.sort((a, b) => {
        const posicaoA = a.ordens && a.ordens.length > 0 ? a.ordens[0].posicao : 0;
        const posicaoB = b.ordens && b.ordens.length > 0 ? b.ordens[0].posicao : 0;
        return posicaoA - posicaoB;
      });
    }

    if (meal.substituicoes && meal.substituicoes.length > 0) {
      meal.substituicoes.forEach(replacement => {
        replacement.alimentos.sort((a, b) => {
          const posicaoA = a.ordens && a.ordens.length > 0 ? a.ordens[0].posicao : 0;
          const posicaoB = b.ordens && b.ordens.length > 0 ? b.ordens[0].posicao : 0;
          return posicaoA - posicaoB;
        });
      });
    }
  });

  return meals;
}

const useClassicPlan = create<ClassicPlanStore>((set) => ({
  planId: 0,
  patientID: 0,
  observacao: '',

  orientations: [],
  itensListaCompra: [],

  totalCalories: 0,

  meals: [],

  selectedMealId: null,
  selectedMeal: null,
  selectedFood: null,
  selectedNutrients: [],
  equivalentFoodsQuery: '',
  showEquivalentFoodModal: false,

  ...useMealActions(set),
  ...useMealFoodActions(set),
  ...useReplacementMealActions(set),
  ...useReplacementMealFoodActions(set),

  setPlan: (plan) =>
    set(() => {
      return {
        planId: plan.id,
        patientID: plan.idPaciente,
        observacao: plan.observacao,
        orientations: plan.orientations,
        itensListaCompra: plan.itensListaCompra,
        meals: sortMealsAndFoods(plan.meals ?? []),
      };
    }),

  updatePlan: (plan) =>
    set(() => {
      return {
        ...plan
      };
    }),

  setSelectedMeal: (meal) =>
    set(() => {
      return { selectedMeal: meal };
    }),

  setSelectedMealId: (mealId) =>
    set(() => {
      return { selectedMealId: mealId };
    }),

  setSelectedNutrients: (nutrients) => {
    if (nutrients.length > 3) return;

    set(() => {
      return { selectedNutrients: nutrients };
    });
  },

  setEquivalentFoodsQuery: (query) =>
    set(() => {
      return { equivalentFoodsQuery: query };
    }),

  rebuildTotalCalories: () => {
    set((state) => {
      const totalCalories = state.meals.reduce((total, meal) => {
        const mealCalories = meal.alimentos.reduce((total, food) => {
          return total + Number(food.calories ?? 0);
        }, 0);

        return total + mealCalories;
      }, 0);

      return { totalCalories };
    });
  },

  handleOpenModalEquivalentFood: (food, mealId) => {
    set(() => ({ showEquivalentFoodModal: food ? true : false }));
    set(() => ({ selectedFood: food }));
    set(() => ({ selectedMealId: mealId }));
  },
}));

export default useClassicPlan;
