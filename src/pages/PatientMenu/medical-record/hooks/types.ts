import { QueryClient } from "@tanstack/react-query";

export type MedicalRecordStore = {
  // eslint-disable-next-line no-unused-vars
  getMedicalRecords: (patient_id: number) => Promise<MedicalRecord[] | false>;
} & MedicalRecordActions;

export type MedicalRecordActions = {
  // eslint-disable-next-line no-unused-vars
  addMedicalRecord: (MedicalRecordData: Partial<MedicalRecord>, queryClient: QueryClient) => Promise<MedicalRecord | false>;
  // eslint-disable-next-line no-unused-vars
  updateMedicalRecord: (MedicalRecordData: MedicalRecord, queryClient: QueryClient) => Promise<MedicalRecord | false>;
  // eslint-disable-next-line no-unused-vars
  removeMedicalRecord: (MedicalRecordData: MedicalRecord, queryClient: QueryClient) => Promise<boolean>;
};

export interface MedicalRecord {
  id: number;
  date: string;
  patient_id: number;
  professional_id: number;
  text: string | null;
  identification: string | null;
}
