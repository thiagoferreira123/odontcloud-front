import api from "../../../../../services/useAxios";
import { CarePlanBudget, CarePlanBudgetActions } from "./types";
import { notify } from "../../../../../components/toast/NotificationIcon";

const useCarePlanBudgetActions = (): CarePlanBudgetActions => ({
  addCarePlanBudget: async (payload, queryClient) => {
    try {
      const { data } = await api.post<CarePlanBudget>('/budget/', payload);

      queryClient.setQueryData<CarePlanBudget[]>(['carePlanBudgets', payload.budget_care_plan_patient_id], (oldData) => [...(oldData || []), data]);

      notify('Plano de atendimento criado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar plano de atendimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateCarePlanBudget: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<CarePlanBudget>(`/budget/${payload.budget_id}`, payload);

      queryClient.setQueryData<CarePlanBudget[]>(['carePlanBudgets', payload.budget_care_plan_patient_id], (oldData) =>
        oldData ? oldData.map(detail => detail.budget_id === data.budget_id ? data : detail) : []
      );

      notify('Plano de atendimento atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar plano de atendimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeCarePlanBudget: async (careplan, queryClient) => {
    try {
      await api.delete(`/budget/${careplan.budget_id}`);

      queryClient.setQueryData<CarePlanBudget[]>(['carePlanBudgets', careplan.budget_care_plan_patient_id], (oldData) =>
        oldData ? oldData.filter(detail => detail.budget_id !== careplan.budget_id) : []
      );

      notify('Plano de atendimento removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover plano de atendimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useCarePlanBudgetActions;
