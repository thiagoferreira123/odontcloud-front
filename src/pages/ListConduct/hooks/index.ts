import { create } from 'zustand';
import api from '/src/services/useAxios';
import { AxiosError } from 'axios';
import { ConductStore } from './types';
import useConductActions from './ListConductActions';

const useConductStore = create<ConductStore>((set) => ({
  getConductList: async (patient_id) => {
    try {
      const response = await api.get(`/condutas/paciente/${patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useConductActions()
}));

export default useConductStore;
