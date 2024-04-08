import { create } from 'zustand';
import { ChecklistConduct, ChecklistConductsStore } from './types';
import { AxiosError } from 'axios';
import useChecklistConductsActions from './ChecklistConductActions';
import api from '../../../../../services/useAxios';

const useChecklistConductsStore = create<ChecklistConductsStore>((set) => ({
  getChecklistConduct: async (patient_id) => {
    try {
      const response = await api.get<ChecklistConduct[]>(`/lista-condutas-historico/paciente/${patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useChecklistConductsActions()
}));

export default useChecklistConductsStore;
