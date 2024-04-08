import { create } from 'zustand';
import { AdminpanelStore } from './types';
import { AxiosError } from 'axios';
import useAdminpanelActions from './AdminpanelActions';
import api from '../../../../services/useAxios';

const useAdminpanelStore = create<AdminpanelStore>((set) => ({
  getAdminpanel: async (month, year) => {
    try {
      const response = await api.get(`/controle-financeiro/?1=1${month ? `&month=${month}` : ''}${year ? `&year=${year}` : ''}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.error(error);
        return [];
      }

      return false;
    }
  },

  ...useAdminpanelActions()

}));

export default useAdminpanelStore;
