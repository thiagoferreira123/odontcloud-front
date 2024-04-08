import { QueryClient } from "@tanstack/react-query";
import { ClassicPlan, WeekDays, createConfigurations } from "../../../../../types/PlanoAlimentarClassico";

export type createClassicPlanStore = {
  plans: ClassicPlan[];

  selectedPlan?: ClassicPlan;

  showModalConfig?: boolean;

  createConfigurations: createConfigurations;
  weekDays: Array<string>;
  parsedWeekDays: WeekDays;

  setSelectedPlan: (plan: ClassicPlan | undefined) => void;
  setShowModalConfig: (showModalConfig: boolean) => void;
} & PlanActions & ConfigurationActions;

export type PlanActions = {
  setPlans: (plans: ClassicPlan[]) => void;
  addPlan: (plan: ClassicPlan, queryClient: QueryClient) => void;
  updatePlan: (plan: Partial<ClassicPlan>, queryClient: QueryClient) => Promise<boolean>;
  removePlan: (plan: ClassicPlan, queryClient: QueryClient) => Promise<boolean>;
};

export type ConfigurationActions = {
  setWeekDays: (plans: Array<string>) => void;
  setParsedWeekDays: (parsedWeekDays: WeekDays) => void;
  updatePlanConfigurations: (config: Partial<createConfigurations>) => void;
};