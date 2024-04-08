import { QueryClient } from "@tanstack/react-query";

export interface Goal {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  frequency: number;
  period: FrequencyType;
  diagnostic_bad:  string;
  diagnostic_media:  string;
  diagnostic_good: string;
  model: string;
  professional_id: number;
  patient_id: number;
  icon_id: null | number;
  goal: null | string;
  recordsPatient: RecordPatient[];
}

export interface RecordPatient {

}

export enum FrequencyType {
  Daily = 'd',
  Weekly = 's',
  Monthly = 'm',
  Yearly = 'a',
}

export type GoalActions = {
  addGoal: (patientDetailData: Partial<Goal>, queryClient: QueryClient) => Promise<Goal | false>;
  updateGoal: (patientDetailData: Goal, queryClient: QueryClient) => Promise<boolean>;
  removeGoal: (goals: Goal, queryClient: QueryClient) => Promise<boolean>;
};

export type GoalStore = {
  getGoal: (patient_id: number) => Promise<Goal[] | false>;
} & GoalActions;
