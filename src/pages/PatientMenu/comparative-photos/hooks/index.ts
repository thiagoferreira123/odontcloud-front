import { create } from 'zustand';
import { ComparativePhotosStore } from './types';
import { AxiosError } from 'axios';
import useComparativePhotosActions from './ComparativePhotosActions';
import api from '../../../../services/useAxios';

const useComparativePhotosStore = create<ComparativePhotosStore>((set) => ({
  getComparativePhotosDetail: async (patient_id) => {
    try {
      const response = await api.get(`/antropometria-foto/paciente/${patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useComparativePhotosActions()
}));

export default useComparativePhotosStore;
