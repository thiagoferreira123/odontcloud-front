import { MultiValue } from 'react-select';
import { ClassicPlan, ClassicPlanMeal, ClassicPlanMealFood, ClassicPlanMealFoodEquivalent, ClassicPlanReplacementMeal, ClassicPlanReplacementMealFood } from '../../../../types/PlanoAlimentarClassico';
import { Option } from '../../../../types/inputs';
import { Food } from '../../../../types/foods';

export type ClassicPlanStore = {
  planId: number;
  patientID: number | null;
  observacao: string;
  meals: ClassicPlanMeal[];

  totalCalories: number;

  selectedMealId: number | null;
  selectedMeal: ClassicPlanMeal | ClassicPlanReplacementMeal | null;
  selectedFood: ClassicPlanMealFood | ClassicPlanReplacementMealFood | null;
  selectedNutrients: MultiValue<Option>;
  equivalentFoodsQuery: string;
  showEquivalentFoodModal: boolean;

  // eslint-disable-next-line no-unused-vars
  setPlan: (plan: ClassicPlan) => void;
  // eslint-disable-next-line no-unused-vars
  updatePlan: (plan: Partial<ClassicPlan>) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedMeal: (meals: ClassicPlanMeal | ClassicPlanReplacementMeal) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedMealId: (mealId: number | null) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedNutrients: (nutrients: MultiValue<Option>) => void;
  // eslint-disable-next-line no-unused-vars
  setEquivalentFoodsQuery: (query: string) => void;
  // eslint-disable-next-line no-unused-vars
  rebuildTotalCalories: () => void;
} & MealActions & MealFoodActions & ReplacementMealActions & ReplacementMealFoodActions;

export type MealActions = {
  // eslint-disable-next-line no-unused-vars
  setMeals: (meals: ClassicPlanMeal[]) => void;
  // eslint-disable-next-line no-unused-vars
  addMeal: (meal: ClassicPlanMeal) => void;
  // eslint-disable-next-line no-unused-vars
  removeMeal: (meal: ClassicPlanMeal) => void;
  // eslint-disable-next-line no-unused-vars
  updateMeal: (meal: Partial<ClassicPlanMeal>) => void;
}

export type MealFoodActions = {
  // eslint-disable-next-line no-unused-vars
  addMealFood: (food: ClassicPlanMealFood) => void;
  // eslint-disable-next-line no-unused-vars
  changeMealFoodId: (foodId: string, food: Partial<ClassicPlanMealFood>) => void;
  // eslint-disable-next-line no-unused-vars
  updateMealFood: (food: Partial<ClassicPlanMealFood>) => void;
  // eslint-disable-next-line no-unused-vars
  removeMealFood: (food: Partial<ClassicPlanMealFood>) => void;
  // eslint-disable-next-line no-unused-vars
  updateMealFoodEquivalents: (food: ClassicPlanMealFood, equivalents: ClassicPlanMealFoodEquivalent[]) => void;
  // eslint-disable-next-line no-unused-vars
  removeMealFoodEquivalents: (MealId: number, equivalent: ClassicPlanMealFoodEquivalent) => void;
  // eslint-disable-next-line no-unused-vars
  getFoodsData: (meals: ClassicPlanMeal[]) => Promise<Food[]>;
}

export type ReplacementMealActions = {
  // eslint-disable-next-line no-unused-vars
  addReplacementMeal: (replacementMeal: ClassicPlanReplacementMeal) => void;
  // eslint-disable-next-line no-unused-vars
  updateReplacementMeal: (replacementMeal: Partial<ClassicPlanReplacementMeal>) => void;
  // eslint-disable-next-line no-unused-vars
  removeReplacementMeal: (replacementMeal: ClassicPlanReplacementMeal) => void;
}

export type ReplacementMealFoodActions = {
  // eslint-disable-next-line no-unused-vars
  addReplacementMealFood: (food: ClassicPlanReplacementMealFood, mealID: number) => void;
  // eslint-disable-next-line no-unused-vars
  updateReplacementMealFood: (food: Partial<ClassicPlanReplacementMealFood>, mealID: number) => void;
  // eslint-disable-next-line no-unused-vars
  changeReplacementMealFoodId: (food: Partial<ClassicPlanReplacementMealFood>, foodId: string, mealID: number) => void;
  // eslint-disable-next-line no-unused-vars
  removeReplacementMealFood: (food: ClassicPlanReplacementMealFood, foodId: number) => void;
  // eslint-disable-next-line no-unused-vars
  updateReplacementMealFoodEquivalents: (food: ClassicPlanReplacementMealFood, mealID: number, equivalents: ClassicPlanMealFoodEquivalent[]) => void;
  // eslint-disable-next-line no-unused-vars
  removeReplacementMealFoodEquivalents: (replacementId: number, MealId: number, equivalent: ClassicPlanMealFoodEquivalent) => void;
}