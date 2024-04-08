import { notify } from "../../../../../components/toast/NotificationIcon";
import api from "../../../../../services/useAxios";
import { ChecklistConductTemplate, ChecklistConductTemplatesActions } from "./types";

const useChecklistConductTemplatesActions = (): ChecklistConductTemplatesActions => ({
  addChecklistConductTemplate: async (checklist, queryClient) => {
    try {
      const { data } = await api.post<ChecklistConductTemplate>('/lista-condutas-modelo/', checklist);

      queryClient.setQueryData<ChecklistConductTemplate[]>(['my-checklists'], (oldData) => [...(oldData || []), data]);

      notify('Checklist adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar checklist', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateChecklistConductTemplate: async (checklist, queryClient) => {
    try {
      const { data } = await api.patch<ChecklistConductTemplate>(`/lista-condutas-modelo/${checklist.id}`, checklist);

      queryClient.setQueryData<ChecklistConductTemplate[]>(['my-checklists'], (oldData) =>
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

  removeChecklistConductTemplate: async (checklist, queryClient) => {
    try {
      await api.delete(`/lista-condutas-modelo/${checklist.id}`);

      queryClient.setQueryData<ChecklistConductTemplate[]>(['my-checklists'], (oldData) =>
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

export default useChecklistConductTemplatesActions;
