import { QueryClient } from "@tanstack/react-query";

export interface SignsSymptoms {
  id: string;
  patient_id: number;
  data: string;
  symptoms: string;
  deficiencies: string;
  excesses: string;
}

export type SignsSymptomsStore = {
  getSignsSymptom: (id: string) => Promise<SignsSymptoms | false>;
  updateSignsSymptom: (patientDetailData: Partial<SignsSymptoms>, queryClient: QueryClient) => Promise<boolean>;
};
