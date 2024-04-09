import { create } from 'zustand';
import { CarePlanBudgetStore } from './types';
import { AxiosError } from 'axios';
import useCarePlanBudgetActions from './CarePlanBudgetActions';
import api from '../../../../services/useAxios';

const useCarePlanBudgetStore = create<CarePlanBudgetStore>((set) => ({
  getCarePlanBudget: async (budget_id) => {
    try {
      const response = await api.get(`/budget/${budget_id}`);
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
