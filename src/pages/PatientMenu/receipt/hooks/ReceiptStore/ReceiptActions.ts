import api from "../../../../../services/useAxios";
import { Receipt, ReceiptActions } from "./types";
import { notify } from "../../../../../components/toast/NotificationIcon";

const useReceiptActions = (): ReceiptActions => ({
  addReceipt: async (patientDetailData, queryClient) => {
    try {
      const { data } = await api.post<Receipt>('/recibo/', patientDetailData);

      queryClient.setQueryData<Receipt[]>(['receipts', patientDetailData.patient_id], (oldData) => [...(oldData || []), data]);

      notify('Recibo adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar recibo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateReceipt: async (patientDetailData, queryClient) => {
    try {
      const { data } = await api.patch<Receipt>(`/recibo/${patientDetailData.id}`, patientDetailData);

      queryClient.setQueryData<Receipt[]>(['receipts', patientDetailData.patient_id], (oldData) =>
        oldData ? oldData.map(detail => detail.id === data.id ? data : detail) : []
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
      await api.delete(`/recibo/${certificate.id}`);

      queryClient.setQueryData<Receipt[]>(['receipts', certificate.patient_id], (oldData) =>
        oldData ? oldData.filter(detail => detail.id !== certificate.id) : []
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
