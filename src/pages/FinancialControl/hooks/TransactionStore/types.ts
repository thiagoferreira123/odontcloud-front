import { QueryClient } from "@tanstack/react-query";

export type TransactionType = 'entrada' | 'saida';

export interface Transaction {
  id: number;
  description: string;
  value: string;
  transaction_type: TransactionType;
  observation: string;
  date: string;
  category_id: number;
  payment_form_id: number;
  professional_id: number;
  paymentMethod: PaymentMethod;
  category: TransactionCategory;
}

export interface PaymentMethod {
  id?: number,
  payment_form: string,
  professional_id?: number
}

export interface TransactionCategory {
  id?: number,
  category: string,
  category_type: string,
  professional_id?: number
}

export type TransactionActions = {
  addTransaction: (transactionData: Partial<Transaction>, month: string, year: string, queryClient: QueryClient) => Promise<number | false>;
  updateTransaction: (transactionData: Partial<Transaction> & { id: number }, month: string, year: string, queryClient: QueryClient) => Promise<boolean>;
  removeTransaction: (transactionId: number, month: string, year: string, queryClient: QueryClient) => Promise<boolean>;
};

export type TransactionStore = {
  getTransactions: (month: string, year: string) => Promise<Transaction[] | false>;
} & TransactionActions;
