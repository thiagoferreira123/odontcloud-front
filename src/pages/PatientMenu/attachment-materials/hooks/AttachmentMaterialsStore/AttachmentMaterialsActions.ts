import { notify } from "../../../../../components/toast/NotificationIcon";
import api from "../../../../../services/useAxios";
import { Attachment } from "../../../../MyMaterials/my-attachments/hooks";
import { AttachmentMaterialsActions, AttachmentMaterialsPatient } from "./types";

const useAttachmentMaterialsActions = (): AttachmentMaterialsActions => ({
  postMaterialToPatient: async (attachment, patient_id, queryClient) => {
    try {

      const payload = {
        patient_id,
        materials_id: attachment.id,
        active: true,
      }

      const { data } = await api.post<AttachmentMaterialsPatient>(`/material-cadastrado-pelo-profissional-selecionado-paciente/`, payload);

      queryClient.setQueryData(['patient-attachments', patient_id.toString()], (oldData: Attachment[] | undefined) => {
        return oldData ? oldData.map(a => {
          return a.id === attachment.id ? { ...a, selecoesPaciente: [data] } : a;
        }) : [{ ...attachment, selecoesPaciente: data }];
      });

      if (data) {
        notify('Material compartilhado com sucesso', 'Sucesso', 'check', 'success');
        return true;
      } else {
        throw new Error('Nenhum material selecionado foi encontrado');
      }
    } catch (error) {
      console.error(error);
      notify('Erro ao buscar materiais', 'Erro', 'close', 'danger');
      return false;
    }
  },

  deleteMaterialFromPatient: async (attachment, queryClient) => {
    try {
      await api.delete(`/material-cadastrado-pelo-profissional-selecionado-paciente/${attachment.selecoesPaciente[0].id}`);

      queryClient.setQueryData(['patient-attachments', attachment.selecoesPaciente[0].patient_id.toString()], (oldData: Attachment[] | undefined) => {
        return oldData ? oldData.map(a => {
          return a.id === attachment.id ? { ...a, selecoesPaciente: [] } : a;
        }) : [];
      });

      notify('Material descompartilhado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      console.error(error);
      notify('Erro ao deletar material', 'Erro', 'close', 'danger');
      return false;
    }
  },
});

export default useAttachmentMaterialsActions;
