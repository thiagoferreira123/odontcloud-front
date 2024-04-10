import { QueryClient } from "@tanstack/react-query";

export interface Receipt {
  receipt_id: string;
  receipt_patient_id: string;
  receipt_patient_name: string;
  receipt_cpf_or_cnpj: string;
  receipt_receipt_value: string;
  receipt_value_in_extension: string;
  receipt_referent_a: string;
  receipt_issuer: string;
  receipt_date_emission: string;
  receipt_cep: string;
  receipt_state: string;
  receipt_city: string;
  receipt_neighborhood: string;
  receipt_street: string;
  receipt_number: string;
}

export type ReceiptActions = {
  addReceipt: (payload: Partial<Receipt>, queryClient: QueryClient) => Promise<Receipt | false>;
  updateReceipt: (payload: Receipt, queryClient: QueryClient) => Promise<boolean>;
  removeReceipt: (certificate: Receipt, queryClient: QueryClient) => Promise<boolean>;
};

export type ReceiptStore = {
  getReceipts: (patient_id: string) => Promise<Receipt[] | false>;
} & ReceiptActions;
