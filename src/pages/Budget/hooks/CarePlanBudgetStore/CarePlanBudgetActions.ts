import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { CarePlanBudget, CarePlanBudgetActions } from "./types";

const useCarePlanBudgetActions = (): CarePlanBudgetActions => ({
  addCarePlanBudget: async (payload, queryClient) => {
    try {
      const { data } = await api.post<CarePlanBudget>('/budget/', payload);

      queryClient.setQueryData<CarePlanBudget[]>(['carePlanBudget'], (oldData) => [...(oldData || []), data]);

      notify('Orçamento criado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar orçamento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateCarePlanBudget: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<CarePlanBudget>(`/budget/${payload.budget_id}`, payload);

      queryClient.setQueryData<CarePlanBudget[]>(['carePlanBudget'], (oldData) =>
        oldData ? oldData.map(detail => detail.budget_id === data.budget_id ? data : detail) : []
      );

      notify('Orçamento atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar orçamento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeCarePlanBudget: async (careplan, queryClient) => {
    try {
      await api.delete(`/budget/${careplan.budget_id}`);

      queryClient.setQueryData<CarePlanBudget[]>(['carePlanBudget'], (oldData) =>
        oldData ? oldData.filter(detail => detail.budget_id !== careplan.budget_id) : []
      );

      notify('Orçamento removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover orçamento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useCarePlanBudgetActions;
