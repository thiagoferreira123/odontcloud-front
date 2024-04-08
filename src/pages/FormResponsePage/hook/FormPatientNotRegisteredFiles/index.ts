import { create } from 'zustand';
import { FormPatientNotRegisteredFilesStore } from './types';
import api from '../../../../services/useAxios';
import { notify } from '../../../../components/toast/NotificationIcon';

const useFormPatientNotRegisteredFilesStore = create<FormPatientNotRegisteredFilesStore>((set) => ({
  loadingCount: 0,
  uploadedFiles: [],
  removeDropzoneFileFunctions: [],

  removeFormFile: async (FormFileData) => {
    try {
      await api.delete(`/fpc-anexo-paciente-nao-cadastrado/${FormFileData.id}`);

      return true;
    } catch (error) {
      notify('Erro ao remover arquivo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
}));

export default useFormPatientNotRegisteredFilesStore;
