import api from "/src/services/useAxios";
import { ConductItem, ConductActions } from "./types";
import { notify } from "/src/components/toast/NotificationIcon";

const useConductActions = (): ConductActions => ({
  addConduct: async (conductData, queryClient) => {
    try {
      const { data } = await api.post<ConductItem>('/lista-condutas-historico/', conductData);

      queryClient.setQueryData<ConductItem[]>(['conducts', conductData.conduct_list_id], (oldData) => [...(oldData || []), data]);

      notify('Conduta adicionada com sucesso', 'Sucesso', 'check', 'success');

      return data?.id ?? false;
    } catch (error) {
      notify('Erro ao adicionar conduta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateConduct: async (conductData, queryClient) => {
    try {
      const { data } = await api.patch<ConductItem>(`/lista-condutas-historico/${conductData.id}`, conductData);

      queryClient.setQueryData<ConductItem[]>(['conducts', conductData.conduct_list_id], (oldData) =>
        oldData ? oldData.map(item => item.id === data.id ? data : item) : []
      );

      notify('Conduta atualizada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar conduta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeConduct: async (conductId, queryClient) => {
    try {
      await api.delete(`/lista-condutas-historico/${conductId}`);
  
      // Ajuste na chamada para usar InvalidateQueryFilters
      queryClient.invalidateQueries({
        queryKey: ['conducts'],
      });
  
      notify('Conduta removida com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover conduta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
  
});

export default useConductActions;
