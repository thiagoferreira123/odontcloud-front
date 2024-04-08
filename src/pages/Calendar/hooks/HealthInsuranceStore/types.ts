import { QueryClient } from "@tanstack/react-query";

export type HealthInsurance = {
  calendar_health_insurance_id?: number;
  calendar_health_insurance_name?: string;
  calendar_health_insurance_responsible?: string;
  calendar_health_insurance_insertion_date?: Date;
  calendar_health_insurance_status?: string;
};

export type HealthInsuranceActions = {
  addHealthInsurance: (healthInsuranceData: Partial<HealthInsurance>, queryClient: QueryClient) => Promise<HealthInsurance | false>;
};

export type HealthInsuranceStore = {
  getHealthInsurances: () => Promise<HealthInsurance[] | false>;
} & HealthInsuranceActions;
