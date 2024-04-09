import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { CarePlanBudget, CarePlanBudgetActions } from "./types";

const useCarePlanBudgetActions = (): CarePlanBudgetActions => ({
  updateCarePlanBudget: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<CarePlanBudget>(`/budget/${payload.budget_id}`, payload);

      // queryClient.setQueryData<CarePlanBudget>(['carePlanBudget', payload.budget_id], (oldData) => {
      //   // if (!oldData) return [data];

      //   return {

      //   };
      // }

      notify('Orçamento atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar orçamento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeCarePlanBudget: async (budget, queryClient) => {
    try {
      await api.delete(`/budget/${budget.budget_id}`);

      // queryClient.setQueryData<CarePlanBudget>(['carePlanBudget', budget.budget_id], (oldData) =>
      //   oldData ? oldData.filter(detail => detail.budget_id !== budget.budget_id) : []
      // );

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
