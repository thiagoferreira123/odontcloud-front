import { QueryClient } from "@tanstack/react-query";

export interface CarePlan {
  care_plan_id: string;
  care_plan_clinic_id: string;
  care_plan_patient_id: string;
  care_plan_date_creation: string;
  care_plan_identification: string;
  teeth: Procedure[];
}
export interface Tooth {
  tooth_id: string;
  tooth_procedure_id: string;
  tooth_number: string;
  tooth_quadrant: string;
  tooth_faces: string;
}
export interface Procedure {
  procedure_id: string;
  procedure_name: string;
  procedure_care_plan_id: string;
  procedure_professional_id: string;
  procedure_value: string;
  procedure_deciduous_or_permanent: "deciduos" | "permanent";
  procedure_observations: string;
  procedure_status: "pending" | "realized" | "pre-existing";
  procedures: Tooth[];
}

export type CarePlanActions = {
  addCarePlan: (careplanDetailData: Partial<CarePlan>, queryClient: QueryClient) => Promise<CarePlan | false>;
  updateCarePlan: (careplanDetailData: CarePlan, queryClient: QueryClient) => Promise<boolean>;
  removeCarePlan: (careplan: CarePlan, queryClient: QueryClient) => Promise<boolean>;
};

export type CarePlanStore = {
  getCarePlans: (care_plan_patient_id: string) => Promise<CarePlan[] | false>;
} & CarePlanActions;
