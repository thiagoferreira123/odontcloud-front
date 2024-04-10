import { create } from 'zustand';
import api from '../../../../../services/useAxios';
import { CertificateStore } from './types';
import { AxiosError } from 'axios';
import useCertificateActions from './CertificateActions';

const useCertificateStore = create<CertificateStore>((set) => ({
  getCertificates: async (patient_id) => {
    try {
      const response = await api.get(`/patient-certificate/by-patient/${patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useCertificateActions()
}));

export default useCertificateStore;
