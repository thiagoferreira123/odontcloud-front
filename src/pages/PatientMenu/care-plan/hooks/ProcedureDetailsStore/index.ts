import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { ProcedureStore } from './types'; 
import { AxiosError } from 'axios';
import useProcedureActions from './ProcedureActions';

const useProcedureStore = create<ProcedureStore>((set) => ({
  getProcedure: async (procedure_id) => {
    try {
      const response = await api.get(`/procedure/${procedure_id}`); 
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useProcedureActions() 
}));

export default useProcedureStore;
