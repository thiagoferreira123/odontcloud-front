import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { Professional, ProfessionalActions } from "./types";

const useProfessionalActions = (): ProfessionalActions => ({
  addProfessional: async (payload, queryClient) => {
    try {
      const { data } = await api.post<Professional>('/professional/', payload);

      queryClient.setQueryData<Professional[]>(['professionals'], (oldData) => [...(oldData || []), data]);

      notify('Profissional adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar profissional', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateProfessional: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<Professional>(`/professional/${payload.professional_id}`, payload);

      queryClient.setQueryData<Professional[]>(['professionals'], (oldData) =>
        oldData ? oldData.map(p => p.professional_id === data.professional_id ? data : p) : []
      );

      notify('Profissional atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar profissional', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeProfessional: async (certificate, queryClient) => {
    try {
      await api.delete(`/professional/${certificate.professional_id}`);

      queryClient.setQueryData<Professional[]>(['professionals'], (oldData) =>
        oldData ? oldData.filter(p => p.professional_id !== certificate.professional_id) : []
      );

      notify('Profissional removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover profissional', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useProfessionalActions;
