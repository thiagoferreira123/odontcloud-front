import { create } from 'zustand';
import { ClinicAnamnesisStore } from './types';
import { AxiosError } from 'axios';
import useClinicAnamnesisActions from './ClinicAnamnesisActions';
import api from '../../../../../services/useAxios';

const useClinicAnamnesisStore = create<ClinicAnamnesisStore>(() => ({
  getClinicAnamnesis: async (anamnesis_clinic_id) => {
    try {
      const response = await api.get(`/clinic-anamnesis/by-clinic/${anamnesis_clinic_id}`);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useClinicAnamnesisActions()
}));

export default useClinicAnamnesisStore;
