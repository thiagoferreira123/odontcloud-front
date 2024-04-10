import { QueryClient } from "@tanstack/react-query";

export interface Certificate {
  certificate_id: string;
  certificate_patient_id: string;
  certificate_patient_name: string;
  certificate_cpf_or_cnpj: string;
  certificate_permanence_start: string;
  certificate_permanence_end: string;
  certificate_date_emission: string;
  certificate_cep: string;
  certificate_state: string;
  certificate_city: string;
  certificate_neighborhood: string;
  certificate_street: string;
  certificate_number: string;
}

export type CertificateActions = {
  addCertificate: (payload: Partial<Certificate>, queryClient: QueryClient) => Promise<Certificate | false>;
  updateCertificate: (payload: Certificate, queryClient: QueryClient) => Promise<boolean>;
  removeCertificate: (certificate: Certificate, queryClient: QueryClient) => Promise<boolean>;
};

export type CertificateStore = {
  getCertificates: (patient_id: string) => Promise<Certificate[] | false>;
} & CertificateActions;
