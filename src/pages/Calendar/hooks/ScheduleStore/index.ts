import { create } from 'zustand';
import { ScheduleStore } from './types';
import { AxiosError } from 'axios';
import useScheduleActions from './ScheduleActions';
import api from '../../../../services/useAxios';

const useScheduleStore = create<ScheduleStore>((set) => ({
  getSchedules: async (calendar_location_id) => {
    try {
      const response = await api.get(`/agenda/location/${calendar_location_id}`);
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
