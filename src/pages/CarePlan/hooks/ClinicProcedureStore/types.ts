export interface ClinicProcedure {
  clinic_procedure_id: string;
  clinic_procedure_clinic_id: string;
  clinic_procedure_description: string;
  clinic_procedure_value: string;
}

export type ClinicProcedureStore = {
  getClinicProcedures: (clinic_procedure_clinic_id: string) => Promise<ClinicProcedure[] | false>;
};
