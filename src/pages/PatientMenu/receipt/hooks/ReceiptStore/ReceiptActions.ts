import api from "../../../../../services/useAxios";
import { Receipt, ReceiptActions } from "./types";
import { notify } from "../../../../../components/toast/NotificationIcon";

const useReceiptActions = (): ReceiptActions => ({
  addReceipt: async (payload, queryClient) => {
    try {
      const { data } = await api.post<Receipt>('/patient-receipt/', payload);

      queryClient.setQueryData<Receipt[]>(['receipts', payload.receipt_patient_id], (oldData) => [...(oldData || []), data]);

      notify('Recibo adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar recibo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateReceipt: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<Receipt>(`/patient-receipt/${payload.receipt_id}`, payload);

      queryClient.setQueryData<Receipt[]>(['receipts', payload.receipt_patient_id], (oldData) =>
        oldData ? oldData.map(detail => detail.receipt_id === data.receipt_id ? data : detail) : []
      );

      notify('Recibo atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar recibo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeReceipt: async (certificate, queryClient) => {
    try {
      await api.delete(`/patient-receipt/${certificate.receipt_id}`);

      queryClient.setQueryData<Receipt[]>(['receipts', certificate.receipt_patient_id], (oldData) =>
        oldData ? oldData.filter(detail => detail.receipt_id !== certificate.receipt_id) : []
      );

      notify('Recibo removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover recibo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useReceiptActions;
