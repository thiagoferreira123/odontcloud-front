import api from "../../../../../services/useAxios";
import { Tooth, ToothActions } from "./types"; 
import { notify } from "../../../../../components/toast/NotificationIcon";

const useToothActions = (): ToothActions => ({
  
  addTooth: async (toothDetailData, queryClient) => {
    try {
      const { data } = await api.post<Tooth>('/tooth/', toothDetailData); 

      queryClient.setQueryData<Tooth[]>(['tooths', toothDetailData.tooth_id], (oldData) => [...(oldData || []), data]);

      notify('Dente adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar dente', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateTooth: async (toothDetailData, queryClient) => {
    try {
      const { data } = await api.patch<Tooth>(`/tooth/${toothDetailData.tooth_id}`, toothDetailData);

      queryClient.setQueryData<Tooth[]>(['tooths', toothDetailData.tooth_id], (oldData) =>
        oldData ? oldData.map(detail => detail.tooth_id === data.tooth_id ? data : detail) : []
      );

      notify('Dente atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar dente', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeTooth: async (tooth, queryClient) => {
    try {
      await api.delete(`/tooth/${tooth.tooth_id}`); 

      queryClient.setQueryData<Tooth[]>(['tooths', tooth.tooth_id], (oldData) =>
        oldData ? oldData.filter(detail => detail.tooth_id !== tooth.tooth_id) : []
      );

      notify('Dente removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover dente', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useToothActions;
