import { create } from "zustand";
import { createEquivalentEatingPlanStore } from "./types";
import mealActions from "./mealActions";
import useMealFoodActions from "./mealFoodActions";
import useMealReplacementFoodActions from "./mealReplacementFood";
import { listGroups } from "../equivalentPlanListStore/initialState";
import { getSelectedGroups } from "../equivalentPlanListStore/utils";
import { EquivalentEatingPlan, EquivalentEatingPlanMeal, EquivalentEatingPlanMealFood } from "../../../../types/PlanoAlimentarEquivalente";
import api from "../../../../services/useAxios";

export const initialAmounts: number[] = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
]

const sortMealsAndFoods = (meals: EquivalentEatingPlanMeal[]) => {
  meals.sort((a, b) => {
    const posicaoA = a.ordens.length ? a.ordens[0].posicao : 0;
    const posicaoB = b.ordens.length ? b.ordens[0].posicao : 0;
    return posicaoA - posicaoB;
  });
  return meals;
}

export const useEquivalentEatingPlanStore = create<createEquivalentEatingPlanStore>((set) => ({
  meals: [],

  initialAmounts,

  planId: 0,
  patientId: 0,

  selectedFoods: [],

  itensShoppingList: [],

  orientations: [],

  lista_id: 0,

  totalCalories: 0,

  getPlan: async (id) => {
    const { data } = await api<EquivalentEatingPlan>(`/plano-alimentar-equivalente-historico/${id}`);

    const meals: EquivalentEatingPlanMeal[] = data.meals.map((meal: EquivalentEatingPlanMeal) => {
      const selectedGroups = getSelectedGroups(data.alimentosSelecionados, listGroups)

      const amounts = initialAmounts.map((amount: number, index: number) => {
        const alimento = meal.alimentos.find((food: EquivalentEatingPlanMealFood) => {
          return selectedGroups.findIndex((group) => group.name === food.grupo) === index
        });


        return alimento ? Number(alimento.quantidade) : amount;
      });

      return { ...meal, amounts }
    });

    set({
      planId: data.id ?? 0,
      patientId: data.idPaciente,
      meals: sortMealsAndFoods(meals),
      selectedFoods: data.alimentosSelecionados,
      itensShoppingList: data.itensListaCompra,
      orientations: data.orientations,
      lista_id: data.lista_id,
    });
    return data;
  },

  setListId: (lista_id) => set({ lista_id }),

  setOrientations: (orientations) => set({ orientations }),

  setItensShoppingList: (itensShoppingList) => set({ itensShoppingList }),

  setSelectedFoods: (foods) => set({ selectedFoods: foods }),

  addSelectedFood: (food) => {
    set((state) => { return { selectedFoods: [...state.selectedFoods, food] } })
  },

  ...mealActions(set),
  ...useMealFoodActions(set),
  ...useMealReplacementFoodActions(set),
}));