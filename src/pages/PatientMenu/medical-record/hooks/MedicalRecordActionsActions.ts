import api from "/src/services/useAxios";
import { MedicalRecord, MedicalRecordActions } from "./types";
import { notify } from "/src/components/toast/NotificationIcon";

const useMedicalRecordActions = (): MedicalRecordActions => ({
  addMedicalRecord: async (medicalRecordData, queryClient) => {
    try {
      const { data } = await api.post<MedicalRecord>('/prontuario/', medicalRecordData);

      queryClient.setQueryData<MedicalRecord[]>(['medicalRecords', medicalRecordData.patient_id?.toString()], (oldData) => [...(oldData || []), data]);

      notify('Prontuário adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar prontuário', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateMedicalRecord: async (medicalRecordData, queryClient) => {
    try {
      const { data } = await api.patch<MedicalRecord>(`/prontuario/${medicalRecordData.id}`, medicalRecordData);

      queryClient.setQueryData<MedicalRecord[]>(['medicalRecords', medicalRecordData.patient_id?.toString()], (oldData) =>
        oldData ? oldData.map(record => record.id === data.id ? data : record) : []
      );

      notify('Prontuário atualizado com sucesso', 'Sucesso', 'check', 'success');

      return data;
    } catch (error) {
      notify('Erro ao atualizar prontuário', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeMedicalRecord: async (medicalRecordData, queryClient) => {
    try {
      await api.delete(`/prontuario/${medicalRecordData.id}`);

      queryClient.setQueryData<MedicalRecord[]>(
        ['medicalRecords', medicalRecordData.patient_id?.toString()],
        (oldData) => oldData?.filter(anamnese => anamnese.id !== medicalRecordData.id) || []
      );


      notify('Prontuário removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover prontuário', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useMedicalRecordActions;
