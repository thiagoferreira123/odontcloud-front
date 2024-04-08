import api from "../../../../../services/useAxios";
import { GoalsDetails, GoalsDetailsActions } from "./types"; 
import { notify } from "../../../../../components/toast/NotificationIcon";

const useGoalsDetailsActions = (): GoalsDetailsActions => ({
  addGoals: async (patientDetailData, queryClient) => {
    try {
      const { data } = await api.post<GoalsDetails>('/metas/', patientDetailData); 

      queryClient.setQueryData<GoalsDetails[]>(['goals', patientDetailData.patient_id], (oldData) => [...(oldData || []), data]);

      notify('Meta adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar meta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateGoals: async (patientDetailData, queryClient) => {
    try {
      const { data } = await api.patch<GoalsDetails>(`/metas/${patientDetailData.id}`, patientDetailData);

      queryClient.setQueryData<GoalsDetails[]>(['goals', patientDetailData.patient_id], (oldData) =>
        oldData ? oldData.map(detail => detail.id === data.id ? data : detail) : []
      );

      notify('Meta atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar meta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeGoals: async (certificate, queryClient) => {
    try {
      await api.delete(`/metas/${certificate.id}`); 

      queryClient.setQueryData<GoalsDetails[]>(['goals', certificate.patient_id], (oldData) =>
        oldData ? oldData.filter(detail => detail.id !== certificate.id) : []
      );

      notify('Meta removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover meta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useGoalsDetailsActions;
