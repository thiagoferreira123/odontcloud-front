import { create } from 'zustand';
import { ScheduleHistoryStore } from './types';
import { AxiosError } from 'axios';
import useScheduleHistoryActions from './ScheduleHistoryActions';
import api from '../../../../services/useAxios';

const useScheduleHistoryStore = create<ScheduleHistoryStore>((set) => ({
  getScheduleHistorys: async (idLocal) => {
    try {
      const response = await api.get(`/agenda-historico-registros/by-local/${idLocal}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.error(error);
        return [];
      }

      return false;
    }
  },

  ...useScheduleHistoryActions()

}));

export default useScheduleHistoryStore;
