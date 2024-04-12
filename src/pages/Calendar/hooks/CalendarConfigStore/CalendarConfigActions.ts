import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { CalendarConfig, CalendarConfigActions } from "./types";

const useCalendarConfigActions = (): CalendarConfigActions => ({
  addCalendarConfig: async (payload, queryClient) => {
    try {
      const { data } = await api.post<CalendarConfig>('/calendar-config/', payload);

      queryClient.setQueryData<CalendarConfig>(['calendar-config'], (oldData) => oldData ? { ...oldData, ...data } : data);

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar configuração de agenda', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateCalendarConfig: async (payload, queryClient) => {
    try {
      const { data } = await api.put<CalendarConfig>(`/calendar-config/${payload.calendar_config_id}`, payload);

      queryClient.setQueryData<CalendarConfig>(['calendar-config'], (oldData) => oldData ? { ...oldData, ...data } : data);

      notify('Configuração de agendamento atualizada com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao atualizar configuração de agenda', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeCalendarConfig: async (scheduleId, queryClient) => {
    try {
      await api.delete(`/calendar-config/${scheduleId}`);

      queryClient.invalidateQueries({ queryKey: ['calendar-config'] });

      notify('Configuração de agendamento removida com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover configuração de agenda', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useCalendarConfigActions;
