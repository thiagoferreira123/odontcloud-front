import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { Transaction, TransactionActions } from "./types";

const useTransactionActions = (): TransactionActions => ({
  addTransaction: async (payload, queryClient) => {
    try {
      const { data } = await api.post<Transaction>('/clinic-financial-control/', {
        ...payload,
        value: Number(payload.financial_control_value?.replace('.', '').replace(',', '.')),
      });

      const payloadMonth = (new Date(data.financial_control_date).getMonth() + 1).toString().padStart(2, '0');
      const payloadYear = new Date(data.financial_control_date).getFullYear().toString();

      queryClient.setQueryData<Transaction[]>(['my-transactions', payloadMonth, payloadYear], (oldData) => [...(oldData || []), data]);
      queryClient.invalidateQueries({ queryKey: ['my-transactions', payloadYear] });

      notify('Transação adicionada com sucesso', 'Sucesso', 'check', 'success');

      return data?.financial_control_id ?? false;
    } catch (error) {
      notify('Erro ao adicionar transação', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateTransaction: async (payload, month, year, queryClient) => {
    try {
      const { data } = await api.put<Transaction>(`/clinic-financial-control/${payload.financial_control_id}`, {
        ...payload,
        value: Number(payload.financial_control_value?.replace('.', '').replace(',', '.')),
      });

      queryClient.setQueryData<Transaction[]>(['my-transactions', month, year], (oldData) =>
        oldData ? oldData.map(transaction => transaction.financial_control_id === data.financial_control_id ? data : transaction) : []
      );
      queryClient.invalidateQueries({ queryKey: ['my-transactions', year] });

      notify('Transação atualizada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar transação', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeTransaction: async (financial_control_id, month, year, queryClient) => {
    try {
      await api.delete(`/clinic-financial-control/${financial_control_id}`);

      queryClient.setQueryData<Transaction[]>(['my-transactions', month, year], (oldData) =>
        oldData ? oldData.filter(transaction => transaction.financial_control_id !== financial_control_id) : []
      );
      queryClient.invalidateQueries({ queryKey: ['my-transactions', year] });

      notify('Transação removida com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover transação', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useTransactionActions;
