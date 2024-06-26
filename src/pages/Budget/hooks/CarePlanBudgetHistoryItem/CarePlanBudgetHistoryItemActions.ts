import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { CarePlanBudget } from "../CarePlanBudgetStore/types";
import { CarePlanBudgetHistoryItem, CarePlanBudgetHistoryItemActions } from "./types";

const useCarePlanBudgetHistoryItemActions = (): CarePlanBudgetHistoryItemActions => ({
  createMenyCarePlanBudgetHistoryItems: async (payload, queryClient) => {
    try {
      const { data } = await api.post<CarePlanBudgetHistoryItem[]>('/budget-payment-historic/create-payment-history', payload);

      queryClient.setQueryData<CarePlanBudget>(['carePlanBudget', payload.paymentBudgetId], (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            paymentHistorics: data,
          };
        }
      });

      notify('Parcelas criadas com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar parcelas', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateCarePlanBudgetHistoryItem: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<CarePlanBudgetHistoryItem>(`/budget-payment-historic/${payload.payment_id}`, payload);

      queryClient.setQueryData<CarePlanBudget>(['carePlanBudget', payload.payment_budget_id], (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            paymentHistorics: oldData.paymentHistorics.map(detail => detail.payment_id === payload.payment_id ? data : detail),
          };
        }
      });

      notify('Parcela atualizada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar parcela', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeCarePlanBudgetHistoryItem: async (paymentItem, queryClient) => {
    try {
      await api.delete(`/budget-payment-historic/${paymentItem.payment_id}`);

      queryClient.setQueryData<CarePlanBudget>(['carePlanBudget', paymentItem.payment_budget_id], (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            paymentHistorics: oldData.paymentHistorics.filter(detail => detail.payment_id !== paymentItem.payment_id),
          };
        }
      });

      notify('Parcela removida com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover parcela', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useCarePlanBudgetHistoryItemActions;
