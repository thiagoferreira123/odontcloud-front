import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { AxiosError } from 'axios';
import useGoalActions from './GoalActions';
import { GoalStore } from './types';

const useGoalStore = create<GoalStore>((set) => ({
  getGoal: async (patient_id) => {
    try {
      const response = await api.get(`/metas/paciente/${patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useGoalActions()
}));

export default useGoalStore;
