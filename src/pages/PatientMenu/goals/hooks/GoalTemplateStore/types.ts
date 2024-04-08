import { QueryClient } from "@tanstack/query-core";

export interface GoalTemplate {
  id: number;
  professional: number;
  name: string;
  description: string;
}

export type GoalTemplateActions = {
  addGoalTemplate: (patientDetailData: Partial<GoalTemplate>, queryClient: QueryClient) => Promise<GoalTemplate | false>;
  updateGoalTemplate: (patientDetailData: GoalTemplate, queryClient: QueryClient) => Promise<boolean>;
  removeGoalTemplate: (goals: GoalTemplate, queryClient: QueryClient) => Promise<boolean>;
};

export type GoalTemplateStore = {
  getGoalTemplates: () => Promise<GoalTemplate[] | false>;
  getMyGoalTemplates: () => Promise<GoalTemplate[] | false>;
} & GoalTemplateActions;
