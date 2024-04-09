import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { CarePlanBudgetStore } from './types';
import { AxiosError } from 'axios';
import useCarePlanBudgetActions from './CarePlanBudgetActions';

const useCarePlanBudgetStore = create<CarePlanBudgetStore>((set) => ({
  getCarePlanBudgets: async (care_plan_patient_id) => {
    try {
      const response = await api.get(`/budget/by-patient/${care_plan_patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useCarePlanBudgetActions()
}));

export default useCarePlanBudgetStore;
