import api from "../../../../../services/useAxios";
import { Certificate, CertificateActions } from "./types";
import { notify } from "../../../../../components/toast/NotificationIcon";

const useCertificateActions = (): CertificateActions => ({
  addCertificate: async (patientDetailData, queryClient) => {
    try {
      const { data } = await api.post<Certificate>('/atestado/', patientDetailData);

      queryClient.setQueryData<Certificate[]>(['attendances', patientDetailData.patient_id], (oldData) => [...(oldData || []), data]);

      notify('Atestado adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar atestado', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateCertificate: async (patientDetailData, queryClient) => {
    try {
      const { data } = await api.patch<Certificate>(`/atestado/${patientDetailData.id}`, patientDetailData);

      queryClient.setQueryData<Certificate[]>(['attendances', patientDetailData.patient_id], (oldData) =>
        oldData ? oldData.map(detail => detail.id === data.id ? data : detail) : []
      );

      notify('Atestado atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar atestado', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeCertificate: async (certificate, queryClient) => {
    try {
      await api.delete(`/atestado/${certificate.id}`);

      queryClient.setQueryData<Certificate[]>(['attendances', certificate.patient_id], (oldData) =>
        oldData ? oldData.filter(detail => detail.id !== certificate.id) : []
      );

      notify('Atestado removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover atestado', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useCertificateActions;
