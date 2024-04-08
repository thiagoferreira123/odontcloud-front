import { QueryClient } from "@tanstack/react-query";

export interface Receipt {
  id: string;
  patient_id: number;
  patient_name: string;
  cpf_cnpj_do_patient: string;
  receipt_value: string;
  value_by_extension: string;
  issue_date: string;
  referent_to: string;
  receipt_issuer: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
}

export type ReceiptActions = {
  addReceipt: (patientDetailData: Partial<Receipt>, queryClient: QueryClient) => Promise<Receipt | false>;
  updateReceipt: (patientDetailData: Receipt, queryClient: QueryClient) => Promise<boolean>;
  removeReceipt: (certificate: Receipt, queryClient: QueryClient) => Promise<boolean>;
};

export type ReceiptStore = {
  getReceipts: (patient_id: number) => Promise<Receipt[] | false>;
} & ReceiptActions;
