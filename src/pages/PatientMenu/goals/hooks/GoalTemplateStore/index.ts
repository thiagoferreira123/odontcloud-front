import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { GoalTemplateStore } from './types';
import { AxiosError } from 'axios';
import useGoalTemplateActions from './GoalTemplateActions';

const useGoalTemplateStore = create<GoalTemplateStore>(() => ({
  getGoalTemplates: async () => {
    try {
      const response = await api.get("/metas-modelo/");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  getMyGoalTemplates: async () => {
    try {
      const response = await api.get("/metas-modelo/professional");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useGoalTemplateActions()
}));

export default useGoalTemplateStore;
