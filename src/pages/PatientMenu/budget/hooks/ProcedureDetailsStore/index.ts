import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { ProcedureDetailsStore } from './types'; 
import { AxiosError } from 'axios';
import useProcedureDetailsActions from './ProcedureActions';

const useProcedureDetailsStore = create<ProcedureDetailsStore>((set) => ({
  getProcedureDetails: async (procedure_id) => {
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

  ...useProcedureDetailsActions() 
}));

export default useProcedureDetailsStore;
