import { QueryClient } from "@tanstack/react-query";

export interface SignsSymptoms {
  id: string;
  patient_id: number;
  data: string;
  symptoms: string;
  deficiencies: string;
  excesses: string;
}

export type SignsSymptomsActions = {
  addSignsSymptom: (patientDetailData: Partial<SignsSymptoms>, queryClient: QueryClient) => Promise<string | false>;
  updateSignsSymptom: (patientDetailData: SignsSymptoms, queryClient: QueryClient) => Promise<boolean>;
  removeSignsSymptom: (patientDetailData: SignsSymptoms, queryClient: QueryClient) => Promise<boolean>;
};

export type SignsSymptomsStore = {
  getSignsSymptoms: (patient_id: number) => Promise<SignsSymptoms[] | false>;
} & SignsSymptomsActions;
