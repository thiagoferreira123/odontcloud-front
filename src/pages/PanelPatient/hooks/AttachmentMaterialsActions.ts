import { notify } from "../../../components/toast/NotificationIcon";
import api from "../../../services/useAxios";
import { PatientAttachmentMaterials, PatientAttachmentMaterialsActions } from "./types";

const usePatientAttachmentMaterialsActions = (): PatientAttachmentMaterialsActions => ({

  getAllPatientAttachmentMaterialsByPatientId: async (patientId) => {
    try {
      const { data } = await api.get<PatientAttachmentMaterials[]>(`/material-cadastrado-pelo-profissional-selecionado-paciente/${patientId}`);

      if (data) {
        return data;
      } else {
        throw new Error('Nenhum material selecionado foi encontrado');
      }
    } catch (error) {
      console.error(error);
      notify('Erro ao buscar materiais', 'Erro', 'close', 'danger');
      return false;
    }
  },

  addPatientAttachmentMaterials: async (PatientAttachmentMaterialsData, queryClient) => {
    try {
      const { data } = await api.post<PatientAttachmentMaterials>('/material-cadastrado-pelo-profissional-selecionado-paciente/', PatientAttachmentMaterialsData);

      queryClient.setQueryData<PatientAttachmentMaterials[]>(['medicalRecords', PatientAttachmentMaterialsData.patient_id?.toString()], (oldData) => [...(oldData || []), data]);

      notify('Material compartilhado com sucesso', 'Sucesso', 'check', 'success');

      return data?.id ?? false;
    } catch (error) {
      notify('Erro ao adicionar prontuário', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

 removePatientAttachmentMaterials: async (id, patientId, queryClient) => {
    try {
      await api.delete(`/material-cadastrado-pelo-profissional-selecionado-paciente/${id}`);

      queryClient.setQueryData<PatientAttachmentMaterials[]>(['medicalRecords', patientId.toString()], (oldData) => oldData ? oldData.filter(item => item.id !== id) : []);

      notify('Material removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover material', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default usePatientAttachmentMaterialsActions;
