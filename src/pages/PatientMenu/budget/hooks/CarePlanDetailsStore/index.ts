import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { CarePlanDetailsStore } from './types'; 
import { AxiosError } from 'axios';
import useCarePlanDetailsActions from './CarePlanActions';

const useCarePlanDetailsStore = create<CarePlanDetailsStore>((set) => ({
  getCarePlanDetails: async (care_plan_patient_id) => {
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

  ...useCarePlanDetailsActions() 
}));

export default useCarePlanDetailsStore;
