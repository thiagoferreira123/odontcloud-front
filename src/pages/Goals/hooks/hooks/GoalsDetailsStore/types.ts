import { QueryClient } from "@tanstack/react-query";

export interface GoalsDetails {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  frequency: number;
  period: string;
  diagnostic_bad: number;
  diagnostic_media: number;
  diagnostic_good: number;
  model: number;
  professional_id: number;
  patient_id: number;
  icon_id: null | number;
  goal: null | string;
  recordsPatient: RecordPatient[];
}

export type GoalsDetailsActions = {
  addGoals: (patientDetailData: Partial<GoalsDetails>, queryClient: QueryClient) => Promise<GoalsDetails | false>;
  updateGoals: (patientDetailData: GoalsDetails, queryClient: QueryClient) => Promise<boolean>;
  removeGoals: (certificate: GoalsDetails, queryClient: QueryClient) => Promise<boolean>;
};

export type GoalsDetailsStore = {
  getGoalsDetail: (patient_id: number) => Promise<GoalsDetails[] | false>;
} & GoalsDetailsActions;
