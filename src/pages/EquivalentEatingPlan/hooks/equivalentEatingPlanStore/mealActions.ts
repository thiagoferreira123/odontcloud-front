import api from "/src/services/useAxios";
import { MealActions, createEquivalentEatingPlanStore } from "./types";
import { EquivalentEatingPlanMeal, EquivalentEatingPlanMealFood } from "/src/types/PlanoAlimentarEquivalente";
import { initialAmounts } from ".";
import { listGroups } from "../equivalentPlanListStore/initialState";
import { parseFloatNumber } from "/src/helpers/MathHelpers";
import { calories, carbohydrate, fat, protein } from "/src/pages/EquivalentEatingPlan/meal/utils/MathHelpers";

const useMealActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: createEquivalentEatingPlanStore) => Partial<createEquivalentEatingPlanStore>) => void
) => (<MealActions>{
  setMeals: (meals) =>
    set(() => {
      return { meals };
    }),

  addMeal: async (planId, position) => {
    const payload: Partial<EquivalentEatingPlanMeal> = {
      idPae: planId,
      nome: "",
      comentario: "",
      horario: "",
      calculavel: 1,
      comentarioHtml: null,
      tipoTexto: null,
      textoDaRefeicao: "",
      linkImagem: null,
      alimentos: [],
      alimentosSubstitutos: [],
      ordens: [{
        posicao: position
      }],
      amounts: []
    };

    const { data } = await api.post('/plano-alimentar-equivalente-refeicao', payload);

    data.amounts = initialAmounts.map((amount: number, index: number) => {
      const alimento = data.alimentos.find((food: EquivalentEatingPlanMealFood) => {
        return listGroups.findIndex((group) => group.name === food.grupo) === index
      });

      return alimento ? Number(alimento.quantidade) : amount;
    });

    set((state) => {
      return { meals: [...state.meals, data] };
    })
  },

  cloneMeal: async (mealId) => {
    const { data } = await api.get(`/plano-alimentar-equivalente-refeicao/${mealId}/clone`);

    data.amounts = initialAmounts.map((amount: number, index: number) => {
      const alimento = data.alimentos.find((food: EquivalentEatingPlanMealFood) => {
        return listGroups.findIndex((group) => group.name === food.grupo) === index
      });

      return alimento ? Number(alimento.quantidade) : amount;
    });

    set((state) => {
      return { meals: [...state.meals, data] };
    })
  },

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

  updateMealMacros: (meal) => {
    set((state) => {
      const meals = state.meals.map((m) => {
        if (m.id === meal.id) {

          const payload = {
            carboidratos: parseFloatNumber(carbohydrate(m.alimentos)),
            lipideos: parseFloatNumber(protein(m.alimentos)),
            proteinas: parseFloatNumber(fat(m.alimentos)),
            kcal: parseFloatNumber(calories(m.alimentos)),
          }

          api.patch(`/plano-alimentar-equivalente-refeicao/${m.id}`, payload);
        }
        return m;
      });

      return { meals: meals };
    });
  },
})

export default useMealActions;