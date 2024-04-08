import { create } from 'zustand';
import { AxiosError } from 'axios';
import api from '../../../services/useAxios';
import { TransactionCategory } from './TransactionStore/types';

interface TransactionCategoryStore {
  getTransactionCategories: () => Promise<TransactionCategory[] | false>;
}

const useTransactionCategoryStore = create<TransactionCategoryStore>((set) => ({
  getTransactionCategories: async () => {
    try {
      const response = await api.get("/controle-financeiro-transacao-categoria/");
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

export default useTransactionCategoryStore;
