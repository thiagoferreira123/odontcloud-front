import { create } from 'zustand';
import { ScheduleStore } from './types';
import { AxiosError } from 'axios';
import useScheduleActions from './ScheduleActions';
import api from '../../../../services/useAxios';

const useScheduleStore = create<ScheduleStore>((set) => ({
  getSchedules: async () => {
    try {
      const response = await api.get('/calendar/by-clinic/');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.error(error);
        return [];
      }

      return false;
    }
  },

  ...useScheduleActions()

}));

export default useScheduleStore;
