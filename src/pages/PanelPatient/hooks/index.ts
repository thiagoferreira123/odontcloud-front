import { create } from 'zustand';
import { AxiosError } from 'axios';
import api from '../../../services/useAxios';
import { PatientAttachmentMaterialsStore } from './types';
import usePatientAttachmentMaterialsActions from './AttachmentMaterialsActions';
import { SendingMaterial } from '../../../types/SendingMaterial';

const usePatientAttachmentMaterialsStore = create<PatientAttachmentMaterialsStore>(() => ({
  getPatientAttachmentMaterials: async (patientId) => {
    try {
      const response = await api.get<SendingMaterial[]>(`/materiail-entregavel/patient-panel/${patientId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...usePatientAttachmentMaterialsActions()

}));

export default usePatientAttachmentMaterialsStore;
