import { create } from 'zustand';
import { HealthInsuranceStore } from './types';
import { AxiosError } from 'axios';
import useHealthInsuranceActions from './HealthInsuranceActions';
import api from '../../../../services/useAxios';

const useHealthInsuranceStore = create<HealthInsuranceStore>((set) => ({
  getHealthInsurances: async () => {
    try {
      const response = await api.get("/agenda-convenio");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.error(error);
        return [];
      }

      return false;
    }
  },

  ...useHealthInsuranceActions()

}));

export default useHealthInsuranceStore;
