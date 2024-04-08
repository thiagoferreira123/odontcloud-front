import api from "../../../../../services/useAxios";
import { Goal, GoalActions } from "./types";
import { notify } from "../../../../../components/toast/NotificationIcon";

const useGoalActions = (): GoalActions => ({
  addGoal: async (goalData, queryClient) => {
    try {
      const { data } = await api.post<Goal>('/metas/', goalData);

      queryClient.setQueryData<Goal[]>(['goals', goalData.patient_id], (oldData) => [data, ...(oldData || [])]);

      notify('Meta adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar meta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateGoal: async (goalData, queryClient) => {
    try {
      const { data } = await api.put<Goal>(`/metas/${goalData.id}`, goalData);

      queryClient.setQueryData<Goal[]>(['goals', goalData.patient_id], (oldData) =>
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

  removeGoal: async (goals, queryClient) => {
    try {
      await api.delete(`/metas/${goals.id}`);

      queryClient.setQueryData<Goal[]>(['goals', goals.patient_id], (oldData) =>
        oldData ? oldData.filter(detail => detail.id !== goals.id) : []
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

export default useGoalActions;
