import { notify } from "../../../../components/toast/NotificationIcon";
import { AppException } from "../../../../helpers/ErrorHelpers";
import { generateRecurrenceDates, notEmpty } from "../../../../helpers/Utils";
import api from "../../../../services/useAxios";
import { RecurrenceType } from "../../../../types/Events";
import { Schedule, ScheduleActions } from "./types";

const useScheduleActions = (): ScheduleActions => ({
  addSchedule: async (scheduleData, queryClient) => {
    try {
      const { data } = await api.post<Schedule>('/agenda/', {...scheduleData});

      queryClient.setQueryData<Schedule[]>(['schedules', scheduleData.calendar_location_id], (oldData) => [...(oldData || []), data]);

      notify('Agendamento adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar agendamento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  buildRecurrencySchedules: (scheduleData) => {
    try {
      if(!scheduleData.calendar_recurrence_quantity) throw new AppException('O campo calendar_recurrence_quantity é obrigatório');
      if(!scheduleData.calendar_recurrency_type_qnt) throw new AppException('O campo recurrency_type_qnt é obrigatório');
      if(!scheduleData.calendar_date) throw new AppException('O campo calendar_date é obrigatório');

      const recurrenceType = scheduleData.calendar_recurrence as RecurrenceType;
      const recurrenceRepeatQuantity = +scheduleData.calendar_recurrence_quantity;
      const argument = scheduleData.calendar_recurrence_date_end ? new Date(scheduleData.calendar_recurrence_date_end) : +scheduleData.calendar_recurrency_type_qnt;
      const dates = generateRecurrenceDates(scheduleData.calendar_date, recurrenceType, recurrenceRepeatQuantity, argument);

      const schedules = dates.map((date) => {
        return { ...scheduleData, calendar_date: date };
      });

      return schedules;

    } catch (error) {
      notify('Erro ao adicionar agendamentos', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateSchedule: async (scheduleData, queryClient) => {
    try {
      const { data } = await api.put<Schedule>(`/agenda/${scheduleData.id}`, scheduleData);

      queryClient.setQueryData<Schedule[]>(['schedules', scheduleData.calendar_location_id], (oldData) =>
        oldData ? oldData.map(schedule => schedule.id === data.id ? data : schedule) : []
      );

      notify('Agendamento atualizado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao atualizar agendamento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeSchedule: async (scheduleId, calendar_location_id, queryClient) => {
    try {
      await api.delete(`/agenda/${scheduleId}`);

      queryClient.setQueryData<Schedule[]>(['schedules', calendar_location_id], (oldData) =>
        oldData ? oldData.filter(schedule => schedule.id !== scheduleId) : []
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
