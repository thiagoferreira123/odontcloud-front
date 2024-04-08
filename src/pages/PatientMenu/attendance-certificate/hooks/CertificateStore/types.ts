import { QueryClient } from "@tanstack/react-query";

export interface Certificate {
  id: string;
  patient_id: number;
  patient_name: string;
  cpf_cnpj_do_patient: string;
  permanence_start: string;
  permanencia_end: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  date_issue: string;
}

export type CertificateActions = {
  addCertificate: (patientDetailData: Partial<Certificate>, queryClient: QueryClient) => Promise<Certificate | false>;
  updateCertificate: (patientDetailData: Certificate, queryClient: QueryClient) => Promise<boolean>;
  removeCertificate: (certificate: Certificate, queryClient: QueryClient) => Promise<boolean>;
};

export type CertificateStore = {
  getCertificates: (patient_id: number) => Promise<Certificate[] | false>;
} & CertificateActions;
