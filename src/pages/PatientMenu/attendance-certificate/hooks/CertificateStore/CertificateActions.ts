import api from "../../../../../services/useAxios";
import { Certificate, CertificateActions } from "./types";
import { notify } from "../../../../../components/toast/NotificationIcon";

const useCertificateActions = (): CertificateActions => ({
  addCertificate: async (payload, queryClient) => {
    try {
      const { data } = await api.post<Certificate>('/patient-certificate/', payload);

      queryClient.setQueryData<Certificate[]>(['patient-certificate', payload.certificate_patient_id], (oldData) => [...(oldData || []), data]);

      notify('Atestado adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar atestado', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateCertificate: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<Certificate>(`/patient-certificate/${payload.certificate_id}`, payload);

      queryClient.setQueryData<Certificate[]>(['patient-certificate', payload.certificate_patient_id], (oldData) =>
        oldData ? oldData.map(detail => detail.certificate_id === data.certificate_id ? data : detail) : []
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
      await api.delete(`/patient-certificate/${certificate.certificate_id}`);

      queryClient.setQueryData<Certificate[]>(['patient-certificate', certificate.certificate_patient_id], (oldData) =>
        oldData ? oldData.filter(detail => detail.certificate_id !== certificate.certificate_id) : []
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
