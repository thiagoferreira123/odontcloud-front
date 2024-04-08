import { create } from 'zustand';
import { createClassicPlanStore } from './useClassicPlans/types';
import usePlanActions from './useClassicPlans/usePlanActions';
import useConfigurationActions from './useClassicPlans/useConfigurationActions';

export type WeekDays = {
  dom: number;
  seg: number;
  ter: number;
  qua: number;
  qui: number;
  sex: number;
  sab: number;
};

const useClassicPlans = create<createClassicPlanStore>((set) => ({
  plans: [],

  selectedPlan: undefined,

  showModalConfig: false,

  createConfigurations: {
    nome: '',
    periodizacaoFim: '',
    periodizacaoInicio: '',
  },
  weekDays: [],
  parsedWeekDays: {
    dom: 1,
    seg: 1,
    ter: 1,
    qua: 1,
    qui: 1,
    sex: 1,
    sab: 1,
  },

  setSelectedPlan: (plan) =>
    set((state) => {
      return { ...state, selectedPlan: plan };
    }),

  setShowModalConfig: (showModalConfig) =>
    set((state) => {
      return { ...state, showModalConfig };
    }),

  ...useConfigurationActions(set),
  ...usePlanActions(set),
}));

export default useClassicPlans;
