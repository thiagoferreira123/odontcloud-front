import { create } from 'zustand';
import api from '/src/services/useAxios';
import { QualitativeEatingPlanStore } from './types';
import usePlanActions from './usePlanActions';
import { AxiosError } from 'axios';

const useQualitativeEatingPlans = create<QualitativeEatingPlanStore>(() => ({
  getPlans: async (patientId) => {
    try {
      const response = await api.get('/plano-alimentar-qualitativo-historico/paciente/' + patientId);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) { console.error(error); return false }
      return [];
    }
  },

  ...usePlanActions()
}));

export default useQualitativeEatingPlans;
