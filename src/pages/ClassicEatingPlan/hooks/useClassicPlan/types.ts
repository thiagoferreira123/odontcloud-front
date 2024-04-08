import { MultiValue } from 'react-select';
import { ClassicPlan, ClassicPlanMeal, ClassicPlanMealFood, ClassicPlanMealFoodEquivalent, ClassicPlanOrientation, ClassicPlanReplacementMeal, ClassicPlanReplacementMealFood } from '../../../../types/PlanoAlimentarClassico';
import { ShoppingListItem } from '../../../../types/ShoppingList';
import { Option } from '../../../../types/inputs';
import { Food } from '../../../../types/foods';

export type ClassicPlanStore = {
  planId: number;
  patientID: number | null;
  observacao: string;
  meals: ClassicPlanMeal[];

  orientations: ClassicPlanOrientation[];
  itensListaCompra: ShoppingListItem[];

  totalCalories: number;

  selectedMealId: number | null;
  selectedMeal: ClassicPlanMeal | ClassicPlanReplacementMeal | null;
  selectedFood: ClassicPlanMealFood | ClassicPlanReplacementMealFood | null;
  selectedNutrients: MultiValue<Option>;
  equivalentFoodsQuery: string;
  showEquivalentFoodModal: boolean;

  setPlan: (plan: ClassicPlan) => void;
  updatePlan: (plan: Partial<ClassicPlan>) => void;
  setSelectedMeal: (meals: ClassicPlanMeal | ClassicPlanReplacementMeal) => void;
  setSelectedMealId: (mealId: number | null) => void;
  setSelectedNutrients: (nutrients: MultiValue<Option>) => void;
  setEquivalentFoodsQuery: (query: string) => void;
  handleOpenModalEquivalentFood: (food: ClassicPlanMealFood | ClassicPlanReplacementMealFood | null, meal?: number) => void;
  rebuildTotalCalories: () => void;
} & MealActions & MealFoodActions & ReplacementMealActions & ReplacementMealFoodActions;

export type MealActions = {
  setMeals: (meals: ClassicPlanMeal[]) => void;
  addMeal: (meal: ClassicPlanMeal) => void;
  removeMeal: (meal: ClassicPlanMeal) => void;
  updateMeal: (meal: Partial<ClassicPlanMeal>) => void;
}

export type MealFoodActions = {
  addMealFood: (food: ClassicPlanMealFood) => void;
  changeMealFoodId: (foodId: string, food: Partial<ClassicPlanMealFood>) => void;
  updateMealFood: (food: Partial<ClassicPlanMealFood>) => void;
  removeMealFood: (food: Partial<ClassicPlanMealFood>) => void;
  updateMealFoodEquivalents: (food: ClassicPlanMealFood, equivalents: ClassicPlanMealFoodEquivalent[]) => void;
  removeMealFoodEquivalents: (MealId: number, equivalent: ClassicPlanMealFoodEquivalent) => void;
  getFoodsData: (meals: ClassicPlanMeal[]) => Promise<Food[]>;
}

export type ReplacementMealActions = {
  addReplacementMeal: (replacementMeal: ClassicPlanReplacementMeal) => void;
  updateReplacementMeal: (replacementMeal: Partial<ClassicPlanReplacementMeal>) => void;
  removeReplacementMeal: (replacementMeal: ClassicPlanReplacementMeal) => void;
}

export type ReplacementMealFoodActions = {
  addReplacementMealFood: (food: ClassicPlanReplacementMealFood, mealID: number) => void;
  updateReplacementMealFood: (food: Partial<ClassicPlanReplacementMealFood>, mealID: number) => void;
  changeReplacementMealFoodId: (food: Partial<ClassicPlanReplacementMealFood>, foodId: string, mealID: number) => void;
  removeReplacementMealFood: (food: ClassicPlanReplacementMealFood, foodId: number) => void;
  updateReplacementMealFoodEquivalents: (food: ClassicPlanReplacementMealFood, mealID: number, equivalents: ClassicPlanMealFoodEquivalent[]) => void;
  removeReplacementMealFoodEquivalents: (replacementId: number, MealId: number, equivalent: ClassicPlanMealFoodEquivalent) => void;
}