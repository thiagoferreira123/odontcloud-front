import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { ReceiptStore } from './types';
import { AxiosError } from 'axios';
import useReceiptActions from './ReceiptActions';

const useReceiptStore = create<ReceiptStore>((set) => ({
  getReceipts: async (patient_id) => {
    try {
      const response = await api.get(`/patient-receipt/by-patient/${patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useReceiptActions()
}));

export default useReceiptStore;
