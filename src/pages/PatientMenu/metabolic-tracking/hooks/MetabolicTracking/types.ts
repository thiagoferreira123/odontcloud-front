import { QueryClient } from "@tanstack/react-query";

export type MetabolicTrackingStore = {
  getMetabolicTrackings: (patient_id: number) => Promise<MetabolicTracking[] | false>;
} & MetabolicTrackingActions;

export interface MetabolicTracking {
  // id: number;
  // data: Date;
  // tracking_full: string;
  // patient_id: number;
  // professional_id: number;
  // released: boolean;

  id: number;
  data: Date;
  symptoms: string;
  deficiencies: string;
  excesses: string;
  patient_id: number;
  punctuation: number;
  description: string;
}

export type MetabolicTrackingActions = {
  addMetabolicTracking: (patientDetailData: Partial<MetabolicTracking>, queryClient: QueryClient) => Promise<MetabolicTracking | false>;
  updateMetabolicTracking: (patientDetailData: MetabolicTracking, queryClient: QueryClient) => Promise<boolean>;
  removeMetabolicTracking: (patientDetailData: MetabolicTracking, queryClient: QueryClient) => Promise<boolean>;
};