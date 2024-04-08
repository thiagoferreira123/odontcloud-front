import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { ScheduleHistory, ScheduleHistoryActions } from "./types";

const useScheduleHistoryActions = (): ScheduleHistoryActions => ({
  addScheduleHistory: async (historyData, queryClient) => {
    try {
      const { data } = await api.post<ScheduleHistory>('/agenda-historico-registros/', historyData);

      queryClient.setQueryData<ScheduleHistory[]>(['schedule-history'], (oldData) => [data, ...(oldData || [])]);

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar histórico de agendamento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useScheduleHistoryActions;
