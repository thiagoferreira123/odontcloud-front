import { notify } from "../../../../components/toast/NotificationIcon";
import { AppException } from "../../../../helpers/ErrorHelpers";
import { generateRecurrenceDates, notEmpty } from "../../../../helpers/Utils";
import api from "../../../../services/useAxios";
import { RecurrenceType } from "../../../../types/Events";
import { Schedule, ScheduleActions } from "./types";

const useScheduleActions = (): ScheduleActions => ({
  addSchedule: async (payload, queryClient) => {
    try {
      const { data } = await api.post<Schedule>('/calendar/', {...payload});

      queryClient.setQueryData<Schedule[]>(['schedules'], (oldData) => [...(oldData || []), data]);

      notify('Agendamento adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar agendamento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  buildRecurrencySchedules: (payload) => {
    try {
      if(!payload.calendar_recurrence_quantity) throw new AppException('O campo calendar_recurrence_quantity é obrigatório');
      if(!payload.calendar_recurrency_type_qnt) throw new AppException('O campo recurrency_type_qnt é obrigatório');
      if(!payload.calendar_date) throw new AppException('O campo calendar_date é obrigatório');

      const recurrenceType = payload.calendar_recurrence as RecurrenceType;
      const recurrenceRepeatQuantity = +payload.calendar_recurrence_quantity;
      const argument = payload.calendar_recurrence_date_end ? new Date(payload.calendar_recurrence_date_end) : +payload.calendar_recurrency_type_qnt;
      const dates = generateRecurrenceDates(payload.calendar_date, recurrenceType, recurrenceRepeatQuantity, argument);

      const schedules = dates.map((date) => {
        return { ...payload, calendar_date: date };
      });

      return schedules;

    } catch (error) {
      notify('Erro ao adicionar agendamentos', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateSchedule: async (payload, queryClient) => {
    try {
      const { data } = await api.put<Schedule>(`/calendar/${payload.calendar_id}`, {...payload, professionals: undefined, alerts: undefined});

      queryClient.setQueryData<Schedule[]>(['schedules'], (oldData) =>
        oldData ? oldData.map(schedule => schedule.calendar_id === data.calendar_id ? data : schedule) : []
      );

      notify('Agendamento atualizado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao atualizar agendamento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeSchedule: async (scheduleId, queryClient) => {
    try {
      await api.delete(`/calendar/${scheduleId}`);

      queryClient.setQueryData<Schedule[]>(['schedules'], (oldData) =>
        oldData ? oldData.filter(schedule => schedule.calendar_id !== scheduleId) : []
      );

      notify('Agendamento removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover agendamento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useScheduleActions;
