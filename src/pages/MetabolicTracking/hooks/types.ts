import { QueryClient } from "@tanstack/react-query";

export interface MetabolicTracking {
  id: number;
  data: Date;
  punctuation: number;
  description: string;
  tracking_full: string;
  patient_id: number;
  professional_id: number;
  released: boolean;
  key?: string;
}

export interface MetabolicTrackingSymptom {
  id: number,
  rastreamento: string,
  number: number
}

export type MetabolicTrackingStore = {
  selectedId: number;
  selectedSynptoms: MetabolicTrackingSymptom[];

  getMetabolicTracking: (patient_id: number) => Promise<MetabolicTracking | false>;
  handleChangeSymptomNumber: (symptom: MetabolicTrackingSymptom) => void;
  updateMetabolicTracking: (patientDetailData: Partial<MetabolicTracking>, queryClient: QueryClient) => Promise<boolean>;
};
