import { ClassicPlan, WeekDays, createConfigurations } from "../../../../../types/PlanoAlimentarClassico";

export type createClassicPlanStore = {
  query: string;
  plans: ClassicPlan[];

  selectedPlan?: ClassicPlan;
  selectedTemplate?: ClassicPlan;

  showModalConfig?: boolean;

  createConfigurations: createConfigurations;
  weekDays: Array<string>;
  parsedWeekDays: WeekDays;

  setQuery: (query: string) => void;
  setSelectedPlan: (plan: ClassicPlan | undefined) => void;
  setSelectedTemplate: (plan: ClassicPlan | undefined) => void;
  setShowModalConfig: (showModalConfig: boolean) => void;
} & PlanActions & ConfigurationActions;

export type PlanActions = {
  setPlans: (plans: ClassicPlan[]) => void;
  addPlan: (plans: ClassicPlan) => void;
  updatePlan: (planId: ClassicPlan) => void;
  removePlan: (planId: string) => void;
};

export type ConfigurationActions = {
  setWeekDays: (plans: Array<string>) => void;
  setParsedWeekDays: (parsedWeekDays: WeekDays) => void;
  updatePlanConfigurations: (config: Partial<createConfigurations>) => void;
};