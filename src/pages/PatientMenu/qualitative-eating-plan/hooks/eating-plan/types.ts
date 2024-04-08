import { QueryClient } from "@tanstack/react-query";

export type QualitativeEatingPlanStore = {
  // eslint-disable-next-line no-unused-vars
  getPlans: (patientId: number) => Promise<QualitativeEatingPlan[] | false>;
} & PlanActions;

export type PlanActions = {
  // eslint-disable-next-line no-unused-vars
  addPlan: (qualitativeEatingPlan: Partial<QualitativeEatingPlan>, queryClient: QueryClient) => Promise<number | false>;
  // eslint-disable-next-line no-unused-vars
  updatePlan: (qualitativeEatingPlan: QualitativeEatingPlan, queryClient: QueryClient, ignoreNotify?: boolean) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  removePlan: (qualitativeEatingPlan: QualitativeEatingPlan, queryClient: QueryClient) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  clone: (qualitativeEatingPlan: QualitativeEatingPlan, queryClient: QueryClient) => Promise<boolean>;
};

export interface QualitativeEatingPlan {
  id: number;
  name: string;
  creationDate: string;
  orientation: string;
  patient_id: number;
  periodizationStart: string | null;
  periodizationEnd: string | null;
  sunday: number,
  monday: number,
  tuesday: number,
  wednesday: number,
  thursday: number,
  friday: number,
  saturday: number,
  visivel: number,
  meals: QualitativeEatingPlanMeal[],
  shoppingList: QualitativeEatingPlanShoppingList,

  [key: string]: string | null | Date | number | QualitativeEatingPlanMeal[] | QualitativeEatingPlanShoppingList | undefined;
}

export interface QualitativeEatingPlanMeal {
  id: number;
  name: string;
  time: string;
  content: string;
  comment: string;
  qualitativePlanId: number;
  commentHtml: string;
  imageUrl: string;
  ordem: QualitativeEatingPlanMealOrder
}

export interface QualitativeEatingPlanMealOrder {
  id: number,
  id_refeicao: number,
  posicao: number
}

export interface QualitativeEatingPlanShoppingList {
  id: number;
  content: string;
  id_plano_qualitativo: number;
}