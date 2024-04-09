import { create } from 'zustand';
import { ProfessionalStore } from './types';
import { AxiosError } from 'axios';
import useProfessionalActions from './ProfessionalActions';
import api from '../../../../services/useAxios';

const useProfessionalStore = create<ProfessionalStore>(() => ({
  getProfessionals: async (professional_clinic_id) => {
    try {
      const response = await api.get(`/professional/by-clinic/${professional_clinic_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useProfessionalActions()
}));

export default useProfessionalStore;
