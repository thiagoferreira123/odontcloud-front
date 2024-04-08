import { create } from 'zustand';
import api from '/src/services/useAxios';
import { MedicalRecordStore } from './types';
import { AxiosError } from 'axios';
import useMedicalRecordActions from './MedicalRecordActionsActions';

const useMedicalRecordStore = create<MedicalRecordStore>(() => ({
  getMedicalRecords: async (patient_id) => {
    try {
      const response = await api.get(`/prontuario/paciente/${patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useMedicalRecordActions()

}));

export default useMedicalRecordStore;
