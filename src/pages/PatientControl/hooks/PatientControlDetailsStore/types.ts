import { QueryClient } from "@tanstack/react-query";
import { Patient } from "../../../../types/Patient";

export type PatientActions = {
  addPatientControl: (patientDetailData: Partial<Patient>, queryClient: QueryClient) => Promise<Patient | false>;
  updatePatientControl: (patientDetailData: Patient, queryClient: QueryClient) => Promise<boolean>;
  removePatientControl: (PatientControl: Patient, queryClient: QueryClient) => Promise<boolean>;
};

export type PatientStore = {
  getPatients: () => Promise<Patient[] | false>;
} & PatientActions;
