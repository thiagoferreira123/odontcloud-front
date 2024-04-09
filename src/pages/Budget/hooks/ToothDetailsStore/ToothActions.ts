import api from "../../../../../services/useAxios";
import { ToothDetails, ToothDetailsActions } from "./types"; 
import { notify } from "../../../../../components/toast/NotificationIcon";

const useToothDetailsActions = (): ToothDetailsActions => ({
  
  addTooth: async (toothDetailData, queryClient) => {
    try {
      const { data } = await api.post<ToothDetails>('/tooth/', toothDetailData); 

      queryClient.setQueryData<ToothDetails[]>(['tooths', toothDetailData.tooth_id], (oldData) => [...(oldData || []), data]);

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
      const { data } = await api.patch<ToothDetails>(`/tooth/${toothDetailData.tooth_id}`, toothDetailData);

      queryClient.setQueryData<ToothDetails[]>(['tooths', toothDetailData.tooth_id], (oldData) =>
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

      queryClient.setQueryData<ToothDetails[]>(['tooths', tooth.tooth_id], (oldData) =>
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

export default useToothDetailsActions;
