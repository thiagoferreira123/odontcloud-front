import api from "../../../../../services/useAxios";
import { GoalTemplate, GoalTemplateActions } from "./types";
import { notify } from "../../../../../components/toast/NotificationIcon";

const useGoalTemplateActions = (): GoalTemplateActions => ({
  addGoalTemplate: async (goalData, queryClient) => {
    try {
      const { data } = await api.post<GoalTemplate>('/metas-modelo/', goalData);

      queryClient.setQueryData<GoalTemplate[]>(['goal-templates'], (oldData) => [data, ...(oldData || [])]);

      notify('Modelo de meta adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar modelo de meta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateGoalTemplate: async (goalData, queryClient) => {
    try {
      const { data } = await api.put<GoalTemplate>(`/metas-modelo/${goalData.id}`, goalData);

      queryClient.setQueryData<GoalTemplate[]>(['goal-templates'], (oldData) =>
        oldData ? oldData.map(detail => detail.id === data.id ? data : detail) : []
      );

      notify('Modelo de meta atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar modelo de meta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeGoalTemplate: async (goals, queryClient) => {
    try {
      await api.delete(`/metas-modelo/${goals.id}`);

      queryClient.setQueryData<GoalTemplate[]>(['goal-templates'], (oldData) =>
        oldData ? oldData.filter(detail => detail.id !== goals.id) : []
      );

      notify('Modelo de meta removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover modelo de meta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useGoalTemplateActions;
