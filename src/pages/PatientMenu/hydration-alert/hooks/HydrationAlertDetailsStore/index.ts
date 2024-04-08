import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { HydrationAlertStore } from './types';
import { AxiosError } from 'axios';
import useHydrationAlertActions from './HydrationAlertActions';

const useHydrationAlertStore = create<HydrationAlertStore>((set) => ({
  getHydrationAlertDetail: async (patient_id) => {
    try {
      const response = await api.get(`/alerta-hidratacao/paciente/${patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useHydrationAlertActions()
}));

export default useHydrationAlertStore;
