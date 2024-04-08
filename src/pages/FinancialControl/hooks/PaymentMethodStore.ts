import { create } from 'zustand';
import { AxiosError } from 'axios';
import api from '../../../services/useAxios';
import { PaymentMethod } from './TransactionStore/types';

interface PaymentMethodStore {
  getTransactionPaymentMethods: () => Promise<PaymentMethod[] | false>;
}

const usePaymentMethodStore = create<PaymentMethodStore>((set) => ({
  getTransactionPaymentMethods: async () => {
    try {
      const response = await api.get("/controle-financeiro-forma-pagamento/");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.error(error);
        return [];
      }

      return false;
    }
  },

}));

export default usePaymentMethodStore;
