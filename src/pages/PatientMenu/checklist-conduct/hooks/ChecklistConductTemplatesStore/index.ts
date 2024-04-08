import { create } from 'zustand';
import { ChecklistConductTemplate, ChecklistConductTemplatesStore } from './types';
import { AxiosError } from 'axios';
import api from '../../../../../services/useAxios';
import useChecklistConductTemplatesActions from './ChecklistConductActions';

const useChecklistConductTemplatesStore = create<ChecklistConductTemplatesStore>(() => ({
  getMyChecklistConduct: async () => {
    try {
      const response = await api.get<ChecklistConductTemplate[]>('/lista-condutas-modelo/professional');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  getChecklistConductTemplates: async () => {
    try {
      const response = await api.get<ChecklistConductTemplate[]>("/lista-condutas-modelo/");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useChecklistConductTemplatesActions(),
}));

export default useChecklistConductTemplatesStore;
