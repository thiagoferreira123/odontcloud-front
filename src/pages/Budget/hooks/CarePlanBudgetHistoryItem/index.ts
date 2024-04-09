import { create } from 'zustand';
import { CarePlanBudgetHistoryItemStore } from './types';
import { AxiosError } from 'axios';
import useCarePlanBudgetHistoryItemActions from './CarePlanBudgetHistoryItemActions';
import api from '../../../../services/useAxios';

const useCarePlanBudgetHistoryItemStore = create<CarePlanBudgetHistoryItemStore>((set) => ({
  getCarePlanBudgetHistoryItem: async (budget_id) => {
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

  ...useCarePlanBudgetHistoryItemActions()
}));

export default useCarePlanBudgetHistoryItemStore;
