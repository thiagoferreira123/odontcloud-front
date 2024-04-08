import { create } from 'zustand';
import { SignsSymptomsStore } from './types';
import { AxiosError } from 'axios';
import useSignsSymptomsActions from './SignsSymptomsActions';
import api from '../../../../../services/useAxios';

const useSignsSymptomsStore = create<SignsSymptomsStore>((set) => ({
  getSignsSymptoms: async (patient_id) => {
    try {
      const response = await api.get(`/sinais-sintomas/patient/${patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useSignsSymptomsActions()
}));

export default useSignsSymptomsStore;
