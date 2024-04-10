import { QueryClient } from "@tanstack/react-query";

export type ClinicAnamnesisStore = {
  getClinicAnamnesis: (anamnesis_patient_id: string) => Promise<ClinicAnamnesis[] | false>;
} & ClinicAnamnesisActions;

export type ClinicAnamnesisActions = {
  addClinicAnamnesis: (payload: Partial<ClinicAnamnesis>, queryClient: QueryClient) => Promise<ClinicAnamnesis | false>;
  updateClinicAnamnesis: (payload: ClinicAnamnesis, queryClient: QueryClient) => Promise<boolean>;
  removeClinicAnamnesis: (payload: ClinicAnamnesis, queryClient: QueryClient) => Promise<boolean>;
};

export interface ClinicAnamnesis {
  clinic_anamnesi_id: string;
  clinic_anamnesi_clinic_id?: string;
  clinic_anamnesi_text?: string;
  clinic_identification?: string;
}
