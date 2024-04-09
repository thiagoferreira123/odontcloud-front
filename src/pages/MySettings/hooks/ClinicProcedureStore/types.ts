import { QueryClient } from "@tanstack/react-query";

export interface ClinicProcedure {
  clinic_procedure_id?: string;
  clinic_procedure_clinic_id?: string;
  clinic_procedure_description: string;
  clinic_procedure_value: string;
}

export type ClinicProcedureActions = {
  addClinicProcedure: (payload: Partial<ClinicProcedure>, queryClient: QueryClient) => Promise<ClinicProcedure | false>;
  updateClinicProcedure: (payload: ClinicProcedure, queryClient: QueryClient) => Promise<boolean>;
  removeClinicProcedure: (certificate: ClinicProcedure, queryClient: QueryClient) => Promise<boolean>;
};

export type ClinicProcedureStore = {
  getClinicProcedures: (clinic_procedure_clinic_id: string) => Promise<ClinicProcedure[] | false>;
} & ClinicProcedureActions;
