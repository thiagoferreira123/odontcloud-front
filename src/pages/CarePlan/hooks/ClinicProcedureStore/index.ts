import { create } from 'zustand';
import { ClinicProcedureStore } from './types';
import { AxiosError } from 'axios';
import api from '../../../../services/useAxios';

const useClinicProcedureStore = create<ClinicProcedureStore>((set) => ({
  getClinicProcedures: async (clinic_procedure_clinic_id) => {
    try {
      const response = await api.get(`/clinic-procedure/by-clinic/${clinic_procedure_clinic_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },
}));

export default useClinicProcedureStore;
