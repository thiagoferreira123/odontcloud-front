import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { PatientFile, PatientFileActions, PatientFolderStore } from "./types";

// eslint-disable-next-line no-unused-vars
const usePatientFileActions = (set: (partial: (state: PatientFolderStore) => Partial<PatientFolderStore>) => void) => (<PatientFileActions>{
  addPatientFile: async (PatientFileData, queryClient) => {
    try {

      queryClient.setQueryData<PatientFile[]>(['patientFolders', PatientFileData.file.pacienteId?.toString()], (oldData) => {
        return [...(oldData?.filter(file => file.id !== PatientFileData.file.id) || []), PatientFileData.file]
      });

      notify('Arquivo adicionado com sucesso', 'Sucesso', 'check', 'success');

      set((state) => ({ uploadedFiles: [...state.uploadedFiles.filter(uploadedFile => uploadedFile.file.id != PatientFileData.file.id)] }));

      if(!PatientFileData.remove) throw new Error('Remove function not found');

      setTimeout(() => PatientFileData.remove(), 0);

      return true;
    } catch (error) {
      notify('Erro ao adicionar arquivo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updatePatientFile: async (PatientFileData, queryClient) => {
    try {
      const { data } = await api.put<PatientFile>(`/pasta-do-paciente/${PatientFileData.id}`, PatientFileData);

      queryClient.setQueryData<PatientFile[]>(['patientFolders', PatientFileData.pacienteId?.toString()], (oldData) =>
        oldData ? oldData.map(record => record.id === data.id ? data : record) : []
      );

      notify('Arquivo atualizado com sucesso', 'Sucesso', 'check', 'success');

      return data;
    } catch (error) {
      notify('Erro ao atualizar arquivo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removePatientFile: async (PatientFileData, queryClient) => {
    try {
      await api.delete(`/pasta-do-paciente/${PatientFileData.id}`);

      queryClient.setQueryData<PatientFile[]>(
        ['patientFolders', PatientFileData.pacienteId?.toString()],
        (oldData) => oldData?.filter(file => file.id !== PatientFileData.id) || []
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
