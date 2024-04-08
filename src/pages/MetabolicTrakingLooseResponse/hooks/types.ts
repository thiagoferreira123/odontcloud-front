import { QueryClient } from "@tanstack/react-query";
import { User } from "../../Auth/Login/hook/types";

export interface MetabolicTracking {
  id: number;
  data: Date;
  punctuation: number;
  description: string;
  tracking_full: string;
  patient_id: number;
  professional_id: number;
  released: boolean;

  key?: string | null;
  name_patient?: string;
  email?: string;
  wpp?: string;
  profissional?: User;
}

export interface MetabolicTrackingSymptom {
  id: number,
  rastreamento: string,
  number: number
}

export type MetabolicTrackingStore = {
  professional_id: number;
  selectedSynptoms: MetabolicTrackingSymptom[];

  name_patient?: string;
  email?: string;
  wpp?: string;

  getMetabolicTracking: (key: string) => Promise<MetabolicTracking | false>;
  setPatientData: (patientDetailData: Partial<MetabolicTracking>) => void;
  handleChangeSymptomNumber: (symptom: MetabolicTrackingSymptom) => void;
  createMetabolicTracking: (patientDetailData: Partial<MetabolicTracking>) => Promise<boolean>;
};
