import { EquivalentEatingPlan, EquivalentEatingPlanGrupoSelectedFood, EquivalentEatingPlanMeal, EquivalentEatingPlanMealFood, EquivalentEatingPlanMealReplacementFood, EquivalentEatingPlanOrientation } from "../../../../types/PlanoAlimentarEquivalente";
import { ShoppingListItem } from "../../../../types/ShoppingList";

export type createEquivalentEatingPlanStore = {
  meals: EquivalentEatingPlanMeal[];
  initialAmounts: number[];
  selectedFoods: EquivalentEatingPlanGrupoSelectedFood[];
  itensShoppingList: ShoppingListItem[];
  orientations: EquivalentEatingPlanOrientation[];
  planId: number;
  patientId: number;
  lista_id: number | null;
  totalCalories: number;

  // eslint-disable-next-line no-unused-vars
  getPlan: (id: string) => Promise<EquivalentEatingPlan>;
  // eslint-disable-next-line no-unused-vars
  setListId: (lista_id: number | null) => void;
  // eslint-disable-next-line no-unused-vars
  setOrientations: (orientations: EquivalentEatingPlanOrientation[]) => void;
  // eslint-disable-next-line no-unused-vars
  setItensShoppingList: (itens: ShoppingListItem[]) => void;
  // eslint-disable-next-line no-unused-vars
  setMeals: (meals: EquivalentEatingPlanMeal[]) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedFoods: (foods: EquivalentEatingPlanGrupoSelectedFood[]) => void;
  // eslint-disable-next-line no-unused-vars
  addSelectedFood: (food: EquivalentEatingPlanGrupoSelectedFood) => void;
} & MealActions & MealFoodActions & MealReplacementFoodActions;

export type MealActions = {
  // eslint-disable-next-line no-unused-vars
  setMeals: (meals: EquivalentEatingPlanMeal[]) => void;
  // eslint-disable-next-line no-unused-vars
  addMeal: (planId: string, position: number) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  cloneMeal: (cloneMeal: number) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  removeMeal: (meal: EquivalentEatingPlanMeal) => void;
  // eslint-disable-next-line no-unused-vars
  updateMeal: (meal: Partial<EquivalentEatingPlanMeal>) => void;
  // eslint-disable-next-line no-unused-vars
  updateMealMacros: (meal: Partial<EquivalentEatingPlanMeal>) => void;
}

export type MealFoodActions = {
  // eslint-disable-next-line no-unused-vars
  addMealFood: (food: EquivalentEatingPlanMealFood) => void;
  // eslint-disable-next-line no-unused-vars
  updateMealFood: (food: Partial<EquivalentEatingPlanMealFood>, id?: string) => void;
  // eslint-disable-next-line no-unused-vars
  removeMealFood: (food: Partial<EquivalentEatingPlanMealFood>) => void;
  removeMealsFoods: () => void;
}

export type MealReplacementFoodActions = {
  // eslint-disable-next-line no-unused-vars
  addMealReplacementFood: (food: EquivalentEatingPlanMealReplacementFood) => void;
  // eslint-disable-next-line no-unused-vars
  updateMealReplacementFood: (food: Partial<EquivalentEatingPlanMealReplacementFood>) => void;
  // eslint-disable-next-line no-unused-vars
  removeMealReplacementFood: (food: Partial<EquivalentEatingPlanMealReplacementFood>) => void;
}