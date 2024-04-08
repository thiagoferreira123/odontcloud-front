import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { CarePlanStore } from './types';
import { AxiosError } from 'axios';
import useCarePlanActions from './CarePlanActions';

const useCarePlanStore = create<CarePlanStore>((set) => ({
  getCarePlans: async (care_plan_patient_id) => {
    try {
      const response = await api.get(`/care-plan/by-patient/${care_plan_patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useCarePlanActions()
}));

export default useCarePlanStore;
