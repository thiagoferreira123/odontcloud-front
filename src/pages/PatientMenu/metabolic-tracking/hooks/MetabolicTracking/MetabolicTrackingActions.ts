import { notify } from "../../../../../components/toast/NotificationIcon";
import api from "../../../../../services/useAxios";
import { MetabolicTracking, MetabolicTrackingActions } from "./types";

const useMetabolicTrackingActions = (): MetabolicTrackingActions => ({
  addMetabolicTracking: async (metabolicTracking, queryClient) => {
    try {
      const { data } = await api.post<MetabolicTracking>('/rastreamemto-metabolico/', metabolicTracking);

      queryClient.setQueryData<MetabolicTracking[]>(['metabolic-trackings', metabolicTracking.patient_id?.toString()], (oldData) => [...(oldData || []), data]);

      notify('Rastreamento metabólico adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar rastreamento metabólico', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateMetabolicTracking: async (metabolicTracking, queryClient) => {
    try {
      await api.put<MetabolicTracking>(`/rastreamemto-metabolico/${metabolicTracking.id}`, metabolicTracking);

      queryClient.setQueryData<MetabolicTracking[]>(['metabolic-trackings', metabolicTracking.patient_id?.toString()], (oldData) =>
        oldData ? oldData.map(detail => detail.id === metabolicTracking.id ? metabolicTracking : detail) : []
      );

      notify('Rastreamento metabólico atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar rastreamento metabólico', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeMetabolicTracking: async (metabolicTracking, queryClient) => {
    try {
      await api.delete(`/rastreamemto-metabolico/${metabolicTracking.id}`);

      queryClient.setQueryData<MetabolicTracking[]>(['metabolic-trackings', metabolicTracking.patient_id?.toString()], (oldData) =>
        oldData ? oldData.filter(detail => detail.id !== metabolicTracking.id) : []
      );

      notify('Rastreamento metabólico removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover rastreamento metabólico', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useMetabolicTrackingActions;



