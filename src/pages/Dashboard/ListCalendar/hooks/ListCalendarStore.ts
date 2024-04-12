import { create } from "zustand";
import api from "../../../../services/useAxios";
import { parseDateToIso } from "../../../../helpers/DateHelper";
import { Schedule } from "../../../Calendar/hooks/ScheduleStore/types";

interface ListCalendarStore {
  getCalendarList: () => Promise<Schedule[]>;
}

export const useListCalendarStore = create<ListCalendarStore>(() => ({
  getCalendarList: async () => {
    const date = parseDateToIso(new Date());

    const { data } = await api.get<Schedule[]>(`/calendar/calendar_date/${date}/by-clinic`);

    return data;
  },
}));