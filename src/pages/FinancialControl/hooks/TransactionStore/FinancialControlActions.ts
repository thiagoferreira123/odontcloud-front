import { notify } from "../../../../components/toast/NotificationIcon";
import { parseBrDateToIso } from "../../../../helpers/DateHelper";
import api from "../../../../services/useAxios";
import { Transaction, TransactionActions } from "./types";

const useTransactionActions = (): TransactionActions => ({
  addTransaction: async (transactionData, month, year, queryClient) => {
    try {
      const { data } = await api.post<Transaction>('/controle-financeiro/', {
        ...transactionData,
        value: Number(transactionData.value?.replace('.', '').replace(',', '.')),
      });

      queryClient.setQueryData<Transaction[]>(['my-transactions', month, year], (oldData) => [...(oldData || []), data]);
      queryClient.invalidateQueries({ queryKey: ['my-transactions', year] });

      notify('Transação adicionada com sucesso', 'Sucesso', 'check', 'success');

      return data?.id ?? false;
    } catch (error) {
      notify('Erro ao adicionar transação', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateTransaction: async (transactionData, month, year, queryClient) => {
    try {
      const { data } = await api.patch<Transaction>(`/controle-financeiro/${transactionData.id}`, {
        ...transactionData,
        value: Number(transactionData.value?.replace('.', '').replace(',', '.')),
      });

      queryClient.setQueryData<Transaction[]>(['my-transactions', month, year], (oldData) =>
        oldData ? oldData.map(transaction => transaction.id === data.id ? data : transaction) : []
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

  removeTransaction: async (transactionId, month, year, queryClient) => {
    try {
      await api.delete(`/controle-financeiro/${transactionId}`);

      queryClient.setQueryData<Transaction[]>(['my-transactions', month, year], (oldData) =>
        oldData ? oldData.filter(transaction => transaction.id !== transactionId) : []
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
