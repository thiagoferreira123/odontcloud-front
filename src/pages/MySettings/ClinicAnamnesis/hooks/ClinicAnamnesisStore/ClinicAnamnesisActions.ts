import { notify } from "../../../../../components/toast/NotificationIcon";
import api from "../../../../../services/useAxios";
import { ClinicAnamnesis, ClinicAnamnesisActions } from "./types";

const useClinicAnamnesisActions = (): ClinicAnamnesisActions => ({
  addClinicAnamnesis: async (payload, queryClient) => {
    try {
      const { data } = await api.post<ClinicAnamnesis>('/clinic-anamnesis/', payload);

      queryClient.setQueryData<ClinicAnamnesis[]>(['anamnesis'], (oldData) => [...(oldData || []), data]);

      notify('Anamnese adicionada com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateClinicAnamnesis: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<ClinicAnamnesis>(`/clinic-anamnesis/${payload.clinic_anamnesi_id}`, payload);

      queryClient.setQueryData<ClinicAnamnesis[]>(['anamnesis'], (oldData) =>
        oldData ? oldData.map(anamnese => anamnese.clinic_anamnesi_id === data.clinic_anamnesi_id ? data : anamnese) : []
      );

      notify('Anamnese atualizada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeClinicAnamnesis: async (payload, queryClient) => {
    try {
      await api.delete(`/clinic-anamnesis/${payload.clinic_anamnesi_id}`);

      queryClient.setQueryData<ClinicAnamnesis[]>(['anamnesis'], (oldData) => oldData?.filter(anamnese => anamnese.clinic_anamnesi_id !== payload.clinic_anamnesi_id) || []);

      notify('Anamnese removida com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },


});

export default useClinicAnamnesisActions;