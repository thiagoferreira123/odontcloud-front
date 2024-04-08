import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { ToothStore } from './types'; 
import { AxiosError } from 'axios';
import useToothActions from './ToothActions';

const useToothStore = create<ToothStore>((set) => ({
  getTooth: async (tooth_id) => {
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

  ...useToothActions() 
}));

export default useToothStore;
