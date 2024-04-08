import { notify } from "../../../../../components/toast/NotificationIcon";
import api from "../../../../../services/useAxios";
import { ChecklistConduct, ChecklistConductsActions } from "./types";

const useChecklistConductsActions = (): ChecklistConductsActions => ({
  addChecklistConduct: async (checklist, queryClient) => {
    try {
      const { data } = await api.post<ChecklistConduct>('/lista-condutas-historico/', checklist);

      queryClient.setQueryData<ChecklistConduct[]>(['lista-condutas-historico', checklist.patient_id], (oldData) => [...(oldData || []), data]);

      notify('Checklist adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar checklist', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateChecklistConduct: async (checklist, queryClient) => {
    try {
      const { data } = await api.patch<ChecklistConduct>(`/lista-condutas-historico/${checklist.id}`, checklist);

      queryClient.setQueryData<ChecklistConduct[]>(['lista-condutas-historico', checklist.patient_id], (oldData) =>
        oldData ? oldData.map(detail => detail.id === data.id ? data : detail) : []
      );

      notify('Checklist atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar checklist', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeChecklistConduct: async (checklist, queryClient) => {
    try {
      await api.delete(`/lista-condutas-historico/${checklist.id}`);

      queryClient.setQueryData<ChecklistConduct[]>(['lista-condutas-historico', checklist.patient_id], (oldData) =>
        oldData ? oldData.filter(detail => detail.id !== checklist.id) : []
      );

      notify('Checklist removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover checklist', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useChecklistConductsActions;
