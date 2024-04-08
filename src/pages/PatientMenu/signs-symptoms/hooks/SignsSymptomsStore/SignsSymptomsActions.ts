import { notify } from "../../../../../components/toast/NotificationIcon";
import api from "../../../../../services/useAxios";
import { SignsSymptoms, SignsSymptomsActions } from "./types";

const useSignsSymptomsActions = (): SignsSymptomsActions => ({
  addSignsSymptom: async (registerDetails, queryClient) => {
    try {
      const { data } = await api.post<SignsSymptoms>('/sinais-sintomas/', registerDetails);

      queryClient.setQueryData<SignsSymptoms[]>(['sinais-sintomas', registerDetails.patient_id], (oldData) => [...(oldData || []), data]);

      notify('Sinais e sintomas adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data?.id ?? false;
    } catch (error) {
      notify('Erro ao adicionar sinais e sintomas ', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateSignsSymptom: async (registerDetails, queryClient) => {
    try {
      const { data } = await api.put<SignsSymptoms>(`/sinais-sintomas/${registerDetails.id}`, registerDetails);

      queryClient.setQueryData<SignsSymptoms[]>(['sinais-sintomas', registerDetails.patient_id], (oldData) =>
        oldData ? oldData.map(detail => detail.id === registerDetails.id ? { ...detail, ...registerDetails } : detail) : []
      );

      notify('Sinais e sintomas atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar sinais e sintomas ', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeSignsSymptom: async (registerDetails, queryClient) => {
    try {
      await api.delete(`/sinais-sintomas/${registerDetails.id}`);

      queryClient.setQueryData<SignsSymptoms[]>(['sinais-sintomas', registerDetails.patient_id], (oldData) => oldData ? oldData.filter(detail => detail.id !== registerDetails.id) : []);

      notify('Sinais e sintomas removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover sinais e sintomas ', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useSignsSymptomsActions;
