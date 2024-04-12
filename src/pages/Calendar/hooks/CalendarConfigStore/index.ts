import { create } from 'zustand';
import { CalendarConfigStore } from './types';
import { AxiosError } from 'axios';
import useCalendarConfigActions from './CalendarConfigActions';
import api from '../../../../services/useAxios';

const useCalendarConfigStore = create<CalendarConfigStore>((set) => ({
  getCalendarConfigs: async () => {
    try {
      const response = await api.get("/calendar-config/by-clinic");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.error(error);
        return [];
      }

      return false;
    }
  },

  ...useCalendarConfigActions()

}));

export default useCalendarConfigStore;
