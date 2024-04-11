import { create } from 'zustand';
import { Transaction, TransactionStore } from './types';
import { AxiosError } from 'axios';
import useTransactionActions from './FinancialControlActions';
import api from '../../../../services/useAxios';

const useTransactionStore = create<TransactionStore>((set) => ({
  getTransactions: async () => {
    try {
      const response = await api.get<Transaction[]>("/clinic-financial-control/by-clinic");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.error(error);
        return [];
      }

      return false;
    }
  },

  getTransactionsByPeriod: async (month, year) => {
    try {
      const response = await api.get<Transaction[]>(`/clinic-financial-control/?1=1${month ? `&month=${month}` : ''}${year ? `&year=${year}` : ''}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.error(error);
        return [];
      }

      return false;
    }
  },

  ...useTransactionActions()

}));

export default useTransactionStore;
