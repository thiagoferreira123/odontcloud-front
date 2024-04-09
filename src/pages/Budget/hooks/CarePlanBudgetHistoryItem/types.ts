import { QueryClient } from "@tanstack/react-query";

export interface CarePlanBudgetHistoryItem {
  payment_id?: string;
  payment_budget_id: string;
  payment_due_date: string;
  payment_installments_number: number;
  payment_installments_value: number;
  payment_installments_value_date_received: Date | null;
  payment_status: string;
  payment_description: string;
}

interface CreateCarePlanBudgetHistoryItemPayload {
  paymentBudgetId: string,
  totalAmount: number,
  installments: number,
  firstPaymentDate: string
}

export type CarePlanBudgetHistoryItemActions = {
  createMenyCarePlanBudgetHistoryItems: (payload: CreateCarePlanBudgetHistoryItemPayload, queryClient: QueryClient) => Promise<CarePlanBudgetHistoryItem[] | false>;
  updateCarePlanBudgetHistoryItem: (payload: CarePlanBudgetHistoryItem, queryClient: QueryClient) => Promise<boolean>;
  removeCarePlanBudgetHistoryItem: (paymentItem: CarePlanBudgetHistoryItem, queryClient: QueryClient) => Promise<boolean>;
};

export type CarePlanBudgetHistoryItemStore = {
  getCarePlanBudgetHistoryItem: (budget_id: string) => Promise<CarePlanBudgetHistoryItem | false>;
} & CarePlanBudgetHistoryItemActions;