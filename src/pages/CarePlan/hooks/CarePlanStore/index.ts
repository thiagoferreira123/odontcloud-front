import { create } from 'zustand';
import { CarePlanStore } from './types';
import { AxiosError } from 'axios';
import api from '../../../../services/useAxios';

const useCarePlanStore = create<CarePlanStore>(() => ({
  getCarePlan: async (care_plan_id) => {
    try {
      const response = await api.get(`/care-plan/${care_plan_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },
}));

export default useCarePlanStore;
