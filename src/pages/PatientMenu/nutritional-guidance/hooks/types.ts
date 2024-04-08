import { QueryClient } from "@tanstack/react-query";


export type NutritionalGuidanceStore = {
  // eslint-disable-next-line no-unused-vars
  getNutritionalGuidanceSelectedPatient: (patient_id: number) => Promise<NutritionalGuidanceSelectedPatient[] | false>;
} & NutritionalGuidanceSelectedPatientActions;

export type NutritionalGuidanceSelectedPatientActions = {
  // eslint-disable-next-line no-unused-vars
  addNutritionalGuidanceSelectedPatient: (guidanceData: Partial<NutritionalGuidanceSelectedPatient>, queryClient: QueryClient) => Promise<NutritionalGuidanceSelectedPatient | false>;
  // eslint-disable-next-line no-unused-vars
  updateNutritionalGuidanceSelectedPatient: (guidanceData: NutritionalGuidanceSelectedPatient, queryClient: QueryClient) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  removeNutritionalGuidanceSelectedPatient: (guidanceData: NutritionalGuidanceSelectedPatient, queryClient: QueryClient) => Promise<boolean>;
};

export interface NutritionalGuidance {
  id: number;
  nome: string;
  orientacao: string;
  id_usuario: number;
  belonging_to_patient: number;
}

export interface NutritionalGuidanceSelectedPatient {
  id: number;
  patient_id: number;
  orientation_id: number;
  active: number;
  professional_id: number;
  date: string;
  identification: string;
  nutritionalGuidance?: NutritionalGuidance | null;
}