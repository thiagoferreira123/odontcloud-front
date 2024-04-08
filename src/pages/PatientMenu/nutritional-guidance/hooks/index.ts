import { create } from 'zustand';
import api from '/src/services/useAxios';
import { NutritionalGuidanceSelectedPatient, NutritionalGuidanceStore } from './types';
import { AxiosError } from 'axios';
import useNutritionalGuidanceActions from './NutritionalGuidanceSelectedPatient';

const useNutritionalGuidanceStore = create<NutritionalGuidanceStore>(() => ({
  getNutritionalGuidanceSelectedPatient: async (patient_id) => {
    try {
      const response = await api.get<NutritionalGuidanceSelectedPatient[]>(`/orientacao-nutricional-selecionada-paciente/paciente/${patient_id}`);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useNutritionalGuidanceActions()
}));

export default useNutritionalGuidanceStore;
