import { QueryClient } from "@tanstack/react-query";

export type TransactionType = 'entrance' | 'output';

export enum TransactionTypeOptions {
  ENTRANCE = 'entrance',
  OUTPUT = 'output'
}

export interface Transaction {
  financial_control_id: string;
  financial_control_description: string;
  financial_control_clinic_id: string;
  financial_control_value: string;
  financial_control_entry_or_exit: TransactionType;
  financial_control_date: string;
  financial_control_category: string;
  financial_control_payment_method: string;
  financial_control_observation: string | null;
}

export interface PaymentMethod {
  id?: number,
  payment_form: string,
  professional_id?: number
}

export type TransactionActions = {
  addTransaction: (payload: Partial<Transaction>, queryClient: QueryClient) => Promise<string | false>;
  updateTransaction: (payload: Partial<Transaction> & { financial_control_id: string }, month: string, year: string, queryClient: QueryClient) => Promise<boolean>;
  removeTransaction: (financial_control_id: string, month: string, year: string, queryClient: QueryClient) => Promise<boolean>;
};

export type TransactionStore = {
  getTransactions: () => Promise<Transaction[] | false>;
  getTransactionsByPeriod: (month: string, year: string) => Promise<Transaction[] | false>;
} & TransactionActions;
