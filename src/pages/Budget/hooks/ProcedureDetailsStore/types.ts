import { QueryClient } from "@tanstack/react-query";

export interface CarePlanDetails {
  care_plan_id: string;
  care_plan_clinic_id: string;
  care_plan_professional_id: string;
  care_plan_patient_id: string;
  care_plan_date_creation: string;
  teeth: ToothDetails[];
}

export interface ToothDetails {
  tooth_id: string;
  tooth_number: string;
  tooth_care_plan_id: string;
  tooth_quadrant: string;
  tooth_faces: string;
  procedures: ProcedureDetails[];
}

export interface ProcedureDetails {
  procedure_id: string;
  procedure_name: string;
  procedure_tooth_id: string;
  procedure_value: string;
  procedure_deciduous_or_permanent: "deciduos" | "permanent";
  procedure_observations: string;
  procedure_status: "pending" | "realized" | "pre-existing"; 
}

export type ProcedureDetailsActions = {
  addProcedure: (procedureDetailData: Partial<ProcedureDetails>, queryClient: QueryClient) => Promise<ProcedureDetails | false>;
  updateProcedure: (procedureDetailData: ProcedureDetails, queryClient: QueryClient) => Promise<boolean>;
  removeProcedure: (procedure_id: ProcedureDetails, queryClient: QueryClient) => Promise<boolean>;
};

export type ProcedureDetailsStore = {
  getProcedureDetails: (procedure_id: number) => Promise<ProcedureDetails[] | false>;
} & ProcedureDetailsActions;
