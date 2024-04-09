import { QueryClient } from "@tanstack/react-query";

export interface CarePlan {
  care_plan_id: string;
  care_plan_clinic_id: string;
  care_plan_patient_id: string;
  care_plan_date_creation: string;
  procedures: Procedure[];
}
export interface Tooth {
  tooth_id?: string;
  tooth_procedure_id?: string;
  tooth_number: string;
  tooth_faces: string;
}
export interface Procedure {
  procedure_id: string;
  procedure_name: string;
  procedure_care_plan_id: string;
  procedure_professional_id?: string;
  procedure_value: string;
  procedure_deciduous_or_permanent: "deciduos" | "permanent";
  procedure_observations: string;
  procedure_status: "pending" | "realized" | "pre-existing";
  teeth: Tooth[];
}

export enum TranslatedProcedureStatus {
  pending = "Pendente",
  realized = "Realizado",
  "pre-existing" = "Pré-existente",
}

export type ProcedureActions = {
  addProcedure: (procedureDetailData: Partial<Procedure>, queryClient: QueryClient) => Promise<Procedure | false>;
  updateProcedure: (procedureDetailData: Procedure, queryClient: QueryClient) => Promise<boolean>;
  removeProcedure: (procedure_id: Procedure, queryClient: QueryClient) => Promise<boolean>;
};

export type ProcedureStore = {
  getProcedure: (procedure_id: number) => Promise<Procedure[] | false>;
} & ProcedureActions;
