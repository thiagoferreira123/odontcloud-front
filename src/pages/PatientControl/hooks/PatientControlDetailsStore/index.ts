import { create } from 'zustand';
import { PatientStore } from './types';
import { AxiosError } from 'axios';
import usePatientActions from './PatientControlActions';
import api from '../../../../services/useAxios';

const usePatientStoretore = create<PatientStore>((set) => ({
  getPatients: async () => {
    try {
      const response = await api.get(`/paciente/`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...usePatientActions()
}));

export default usePatientStoretore;
