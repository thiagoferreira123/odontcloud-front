import { QueryClient } from "@tanstack/react-query";
import { CarePlan } from "../../../CarePlan/hooks/CarePlanStore/types";

export interface CarePlanBudget {
  budget_id: string;
  budget_care_plan_id: string;
  budget_care_plan_professional_id: string;
  budget_care_plan_patient_id: string;
  budget_clinic_id: string;
  budget_name: string;
  budget_date_creation: string;
  budget_value: string;
  budget_payment_method: string;
  budget_discount_type: string;
  budget_discount_value: string;
  budget_number_installments: string;
  budget_due_first_installment: string;
  budget_entry_payment: string;
  budget_pay_day: string;
  budget_observations: string;
  paymentHistorics: CarePlan[];
}

export type CarePlanBudgetActions = {
  addCarePlanBudget: (careplanDetailData: Partial<CarePlanBudget>, queryClient: QueryClient) => Promise<CarePlanBudget | false>;
  updateCarePlanBudget: (careplanDetailData: CarePlanBudget, queryClient: QueryClient) => Promise<boolean>;
  removeCarePlanBudget: (careplan: CarePlanBudget, queryClient: QueryClient) => Promise<boolean>;
};

export type CarePlanBudgetStore = {
  getCarePlanBudget: (budget_id: string) => Promise<CarePlanBudget | false>;
} & CarePlanBudgetActions;