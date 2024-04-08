import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { GoalsDetailsStore } from './types'; 
import { AxiosError } from 'axios';
import useGoalsDetailsActions from './GoalsActions';

const useGoalsDetailsStore = create<GoalsDetailsStore>((set) => ({
  getGoalsDetail: async (patient_id) => {
    try {
      const response = await api.get(`/metas/${patient_id}`); 
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useGoalsDetailsActions() 
}));

export default useGoalsDetailsStore;
