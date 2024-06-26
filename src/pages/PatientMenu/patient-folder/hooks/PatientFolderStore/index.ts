import { create } from 'zustand';
import { AxiosError } from 'axios';
import { PatientFolderStore } from './types';
import usePatientFolderActions from './PatientFileActions';
import api from '../../../../../services/useAxios';

const usePatientFolderStore = create<PatientFolderStore>((set) => ({
  loadingCount: 0,
  uploadedFiles: [],
  removeDropzoneFileFunctions: [],

  increaseLoadingCount: () => {set((state) => ({ loadingCount: state.loadingCount + 1 }))},
  decreaseLoadingCount: () => {set((state) => ({ loadingCount: state.loadingCount - 1 }))},
  addUploadedFile: (uploadedFile) => {set((state) => ({ uploadedFiles: [...state.uploadedFiles, uploadedFile] }))},
  removeUploadedFile: (uploadedFile) => {set((state) => {
    return ({ uploadedFiles: state.uploadedFiles.filter(file => file.file.documents_id !== uploadedFile.documents_id) })
  })},

  getPatientFiles: async (documents_patient_id) => {
    try {
      const response = await api.get(`/patient-documents/by-patient/${documents_patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...usePatientFolderActions(set)

}));

export default usePatientFolderStore;
