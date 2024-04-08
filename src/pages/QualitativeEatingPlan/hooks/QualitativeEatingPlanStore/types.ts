import { Patient } from "../../../../types/Patient";
import { QualitativeEatingPlan, QualitativeEatingPlanMeal, QualitativeEatingPlanShoppingList } from "../../../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types";
import { TemplateMeal } from "../TemplateMealStore";

export type QualitativeEatingPlanStore = {
  qualitativeEatingPlanMeals: QualitativeEatingPlanMeal[];
  patient: Patient | null;
  shoppingList: QualitativeEatingPlanShoppingList | null;
  orientation: string;

  // eslint-disable-next-line no-unused-vars
  getQualitativeEatingPlan: (id: number) => Promise<QualitativeEatingPlan | false>;
  // eslint-disable-next-line no-unused-vars
  updateOrientation: (orientation: string) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  handleSubmitMeals: (id: number, qualitativeEatingPlanMeals: QualitativeEatingPlanMeal[]) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  handleSelectTemplateMeal: (templateMeal: TemplateMeal & { qualitativePlanId: number }) => void;
  // eslint-disable-next-line no-unused-vars
  addMeal: (qualitativePlanId: number) => void;
} & QualitativeEatingPlanMealState & ShoppingListState

export interface QualitativeEatingPlanMealState {
  // eslint-disable-next-line no-unused-vars
  setQualitativeEatingPlanMeals: (meals: QualitativeEatingPlanMeal[]) => void;
  // eslint-disable-next-line no-unused-vars
  updateMeal: (meal: Partial<QualitativeEatingPlanMeal>) => void;
  // eslint-disable-next-line no-unused-vars
  removeQualitativeEatingPlanMeal: (meal: QualitativeEatingPlanMeal) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  updateMealCommentQualitativeEatingPlanMeal: (id: number, comment: string) => void;
  // eslint-disable-next-line no-unused-vars
  cloneMeal: (id: number) => Promise<boolean>;
}

export interface ShoppingListState {
  // eslint-disable-next-line no-unused-vars
  addShoppingList: (payload: Partial<QualitativeEatingPlanShoppingList> & { id_plano_qualitativo: number }) => void;
  // eslint-disable-next-line no-unused-vars
  updateShoppingList: (shoppingList: QualitativeEatingPlanShoppingList) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  removeQualitativeEatingPlanShoppingList: (shoppingList: QualitativeEatingPlanShoppingList) => Promise<boolean>;
}