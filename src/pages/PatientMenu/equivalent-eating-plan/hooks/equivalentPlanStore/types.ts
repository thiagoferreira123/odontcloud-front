import { createConfigurations } from "/src/types/PlanoAlimentarClassico";
import { EquivalentEatingPlan } from "/src/types/PlanoAlimentarEquivalente";

export type createEquivalentEatingPlanStore = {
  plans: EquivalentEatingPlan[];

  selectedPlan?: EquivalentEatingPlan;
  selectedTemplate?: EquivalentEatingPlan;

  showModalConfig?: boolean;

  createConfigurations: createConfigurations;
  weekDays: Array<string>;
  parsedWeekDays: WeekDays;

  // eslint-disable-next-line no-unused-vars
  getPlans: (patientId: number) => Promise<EquivalentEatingPlan[]>;
  // eslint-disable-next-line no-unused-vars
  setSelectedPlan: (plan: EquivalentEatingPlan | undefined) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedTemplate: (plan: EquivalentEatingPlan | undefined) => void;
  // eslint-disable-next-line no-unused-vars
  setShowModalConfig: (showModalConfig: boolean) => void;
} & PlanActions & ConfigurationActions;

export type PlanActions = {
  // eslint-disable-next-line no-unused-vars
  setPlans: (plans: EquivalentEatingPlan[]) => void;
  // eslint-disable-next-line no-unused-vars
  addPlan: (plans: EquivalentEatingPlan) => void;
  // eslint-disable-next-line no-unused-vars
  updatePlan: (planId: EquivalentEatingPlan) => void;
  // eslint-disable-next-line no-unused-vars
  removePlan: (planId: string) => void;
  // eslint-disable-next-line no-unused-vars
};

export type ConfigurationActions = {
  // eslint-disable-next-line no-unused-vars
  setWeekDays: (plans: Array<string>) => void;
  // eslint-disable-next-line no-unused-vars
  setParsedWeekDays: (parsedWeekDays: WeekDays) => void;
  // eslint-disable-next-line no-unused-vars
  updatePlanConfigurations: (config: Partial<createConfigurations>) => void;
};

export type WeekDays = {
  dom: number;
  seg: number;
  ter: number;
  qua: number;
  qui: number;
  sex: number;
  sab: number;
};