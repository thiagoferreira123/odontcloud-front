import { notify } from "../../../../../components/toast/NotificationIcon";
import api from "../../../../../services/useAxios";
import { Anamnesis, AnamnesisActions } from "./types";

const useAnamnesisActions = (): AnamnesisActions => ({
  addAnamnesis: async (payload, queryClient) => {
    try {
      const { data } = await api.post<Anamnesis>('/patient-anamnesis/', payload);

      queryClient.setQueryData<Anamnesis[]>(['anamnesis', payload.anamnesis_patient_id?.toString()], (oldData) => [...(oldData || []), data]);

      notify('Anamnese adicionada com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateAnamnesis: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<Anamnesis>(`/patient-anamnesis/${payload.anamnesis_id}`, payload);

      queryClient.setQueryData<Anamnesis[]>(['anamnesis', payload.anamnesis_patient_id?.toString()], (oldData) =>
        oldData ? oldData.map(anamnese => anamnese.anamnesis_id === data.anamnesis_id ? data : anamnese) : []
      );

      notify('Anamnese atualizada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeAnamnesis: async (payload, queryClient) => {
    try {
      await api.delete(`/patient-anamnesis/${payload.anamnesis_id}`);

      queryClient.setQueryData<Anamnesis[]>(['anamnesis', payload.anamnesis_patient_id?.toString()], (oldData) => oldData?.filter(anamnese => anamnese.anamnesis_id !== payload.anamnesis_id) || []);

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