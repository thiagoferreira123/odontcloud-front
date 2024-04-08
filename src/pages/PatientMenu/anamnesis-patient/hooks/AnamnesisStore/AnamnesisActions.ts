import { notify } from "../../../../../components/toast/NotificationIcon";
import api from "../../../../../services/useAxios";
import { Anamnesis, AnamnesisActions } from "./types";

const useAnamnesisActions = (): AnamnesisActions => ({
  addAnamnesis: async (anamnesisData, queryClient) => {
    try {
      const { data } = await api.post<Anamnesis>('/anamnese/', anamnesisData);

      queryClient.setQueryData<Anamnesis[]>(['anamnesis', anamnesisData.patient_id?.toString()], (oldData) => [...(oldData || []), data]);

      notify('Anamnese adicionada com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateAnamnesis: async (anamnesisData, queryClient) => {
    try {
      const { data } = await api.patch<Anamnesis>(`/anamnese/${anamnesisData.id}`, anamnesisData);

      queryClient.setQueryData<Anamnesis[]>(['anamnesis', anamnesisData.patient_id?.toString()], (oldData) =>
        oldData ? oldData.map(anamnese => anamnese.id === data.id ? data : anamnese) : []
      );

      notify('Anamnese atualizada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeAnamnesis: async (anamnesisData, queryClient) => {
    try {
      await api.delete(`/anamnese/${anamnesisData.id}`);

      queryClient.setQueryData<Anamnesis[]>(['anamnesis', anamnesisData.patient_id?.toString()], (oldData) => oldData?.filter(anamnese => anamnese.id !== anamnesisData.id) || []);

      notify('Anamnese removida com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },


});

export default useAnamnesisActions;