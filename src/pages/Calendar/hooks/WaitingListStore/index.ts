import { create } from 'zustand';
import { WaitingListStore } from './types';
import { AxiosError } from 'axios';
import useWaitingListActions from './WaitingListActions';
import api from '../../../../services/useAxios';

const useWaitingListStore = create<WaitingListStore>((set) => ({
  getWaitingList: async () => {
    try {
      const response = await api.get("/agenda-lista-espera");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useWaitingListActions()
}));

export default useWaitingListStore;
