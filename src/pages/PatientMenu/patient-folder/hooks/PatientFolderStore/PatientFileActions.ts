import { notify } from "../../../../../components/toast/NotificationIcon";
import api from "../../../../../services/useAxios";
import { PatientFile, PatientFileActions, PatientFolderStore } from "./types";

const usePatientFileActions = (set: (partial: (state: PatientFolderStore) => Partial<PatientFolderStore>) => void) => (<PatientFileActions>{
  addPatientFile: async (payload, queryClient) => {
    try {

      queryClient.setQueryData<PatientFile[]>(['patientFolders', payload.file.documents_patient_id?.toString()], (oldData) => {
        return [...(oldData?.filter(file => file.documents_id !== payload.file.documents_id) || []), payload.file]
      });

      notify('Arquivo adicionado com sucesso', 'Sucesso', 'check', 'success');

      set((state) => ({ uploadedFiles: [...state.uploadedFiles.filter(uploadedFile => uploadedFile.file.documents_id != payload.file.documents_id)] }));

      if(!payload.remove) throw new Error('Remove function not found');

      setTimeout(() => payload.remove(), 0);

      return true;
    } catch (error) {
      notify('Erro ao adicionar arquivo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updatePatientFile: async (payload, queryClient) => {
    try {
      const { data } = await api.put<PatientFile>(`/patient-documents/${payload.documents_id}`, payload);

      queryClient.setQueryData<PatientFile[]>(['patientFolders', payload.documents_patient_id?.toString()], (oldData) =>
        oldData ? oldData.map(record => record.documents_id === data.documents_id ? data : record) : []
      );

      notify('Arquivo atualizado com sucesso', 'Sucesso', 'check', 'success');

      return data;
    } catch (error) {
      notify('Erro ao atualizar arquivo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removePatientFile: async (payload, queryClient) => {
    try {
      await api.delete(`/patient-documents/${payload.documents_id}`);

      queryClient.setQueryData<PatientFile[]>(
        ['patientFolders', payload.documents_patient_id?.toString()],
        (oldData) => oldData?.filter(file => file.documents_id !== payload.documents_id) || []
      );

      return true;
    } catch (error) {
      notify('Erro ao remover arquivo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default usePatientFileActions;
