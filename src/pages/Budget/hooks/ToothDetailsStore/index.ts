import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { ToothDetailsStore } from './types'; 
import { AxiosError } from 'axios';
import useToothDetailsActions from './ToothActions';

const useToothDetailsStore = create<ToothDetailsStore>((set) => ({
  getToothDetails: async (tooth_id) => {
    try {
      const response = await api.get(`/tooth/${tooth_id}`); 
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useToothDetailsActions() 
}));

export default useToothDetailsStore;
