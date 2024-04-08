import { create } from 'zustand';
import { createEquivalentEatingPlanStore } from './types';
import useConfigurationActions from './useConfigurationActions';
import usePlanActions from './usePlanActions';
import api from '/src/services/useAxios';

const useEquivalentEatingPlans = create<createEquivalentEatingPlanStore>((set) => ({
  plans: [],

  selectedPlan: undefined,
  selectedTemplate: undefined,

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

  getPlans: async (patientId) => {
    const response = await api.get('/plano-alimentar-equivalente-historico/paciente/' + patientId);

    set((state) => {
      return { ...state, plans: response.data };
    });

    return response.data;
  },

  setSelectedPlan: (plan) =>
    set((state) => {
      return { ...state, selectedPlan: plan };
    }),

  setSelectedTemplate: (plan) =>
    set((state) => {
      return { ...state, selectedTemplate: plan };
    }),

  setShowModalConfig: (showModalConfig) =>
    set((state) => {
      return { ...state, showModalConfig };
    }),

    ...useConfigurationActions(set),
    ...usePlanActions(set),
}));

export default useEquivalentEatingPlans;
