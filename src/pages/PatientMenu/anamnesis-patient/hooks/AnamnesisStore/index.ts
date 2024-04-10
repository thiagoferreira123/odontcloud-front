import { create } from 'zustand';
import { AnamnesisStore } from './types';
import { AxiosError } from 'axios';
import useAnamnesisActions from './AnamnesisActions';
import api from '../../../../../services/useAxios';

const useAnamnesisStore = create<AnamnesisStore>(() => ({
  getAnamnesis: async (anamnesis_patient_id) => {
    try {
      const response = await api.get(`/patient-anamnesis/by-patient/${anamnesis_patient_id}`);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useAnamnesisActions()
}));

export default useAnamnesisStore;
