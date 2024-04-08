import { create } from 'zustand';
import { AttachmentMaterialsStore } from './types';
import { AxiosError } from 'axios';
import useAttachmentMaterialsActions from './AttachmentMaterialsActions';
import api from '../../../../../services/useAxios';
import { Attachment } from '../../../../MyMaterials/my-attachments/hooks';

const useAttachmentMaterialsStore = create<AttachmentMaterialsStore>((set) => ({
  query: '',

  setQuery: (query) => set({ query }),

  getAttachmentMaterials: async (id) => {
    try {
      const response = await api.get<Attachment[]>(`/material-cadastrado-pelo-profissional/patient/${id}`);
      return response.data.sort((a, b) => b.selecoesPaciente.length - a.selecoesPaciente.length);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useAttachmentMaterialsActions()

}));

export default useAttachmentMaterialsStore;
