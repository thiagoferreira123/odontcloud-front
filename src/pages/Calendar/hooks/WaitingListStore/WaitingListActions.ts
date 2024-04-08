import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { WaitingList, WaitingListActions } from "./types";

const useWaitingListActions = (): WaitingListActions => ({
  addWaitingList: async (waitinglistDetailData, queryClient) => {
    try {
      const { data } = await api.post<WaitingList>('/agenda-lista-espera/', waitinglistDetailData);

      queryClient.setQueryData<WaitingList[]>(['waiting-list'], (oldData) => [...(oldData || []), data]);

      notify('Paciente adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar paciente', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeWaitingList: async (waitinglist, queryClient) => {
    try {
      await api.delete(`/agenda-lista-espera/${waitinglist.calendar_waiting_list_id}`);

      queryClient.setQueryData<WaitingList[]>(['waiting-list'], (oldData) =>
        oldData ? oldData.filter(detail => detail.calendar_waiting_list_id !== waitinglist.calendar_waiting_list_id) : []
      );

      notify('Paciente removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover paciente', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useWaitingListActions;
