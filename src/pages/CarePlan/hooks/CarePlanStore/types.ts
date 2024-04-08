export interface CarePlan {
  care_plan_id: string;
  care_plan_clinic_id: string;
  care_plan_patient_id: string;
  care_plan_date_creation: string;
  care_plan_identification: string;
  procedures: Procedure[];
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
  teeth: Tooth[];
}

export type CarePlanStore = {
  getCarePlan: (care_plan_id: string) => Promise<CarePlan | false>;
};
