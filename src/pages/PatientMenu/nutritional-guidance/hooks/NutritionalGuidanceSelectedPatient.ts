import api from "/src/services/useAxios";
import { QueryClient } from "@tanstack/react-query";
import { notify } from "/src/components/toast/NotificationIcon";
import { NutritionalGuidanceSelectedPatient, NutritionalGuidanceSelectedPatientActions } from "./types";

const useNutritionalGuidanceSelectedPatientActions = (): NutritionalGuidanceSelectedPatientActions => ({
  addNutritionalGuidanceSelectedPatient: async (guidanceData: Partial<NutritionalGuidanceSelectedPatient>, queryClient: QueryClient) => {
    try {
      const { data } = await api.post<NutritionalGuidanceSelectedPatient>('/orientacao-nutricional-selecionada-paciente/', {...guidanceData, active: 1});

      // Atualiza a lista de orientações no cache
      queryClient.setQueryData<NutritionalGuidanceSelectedPatient[]>(['nutritionalGuidanceSelectedPatient', guidanceData.patient_id?.toString()], (oldData) => [...(oldData ?? []), data]);

      notify('Orientação nutricional adicionada com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar orientação nutricional', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateNutritionalGuidanceSelectedPatient: async (guidanceData: NutritionalGuidanceSelectedPatient, queryClient: QueryClient) => {
    try {
      const { data } = await api.patch<NutritionalGuidanceSelectedPatient>(`/orientacao-nutricional-selecionada-paciente/${guidanceData.id}`, guidanceData);

      queryClient.setQueryData<NutritionalGuidanceSelectedPatient[]>(['nutritionalGuidanceSelectedPatient', guidanceData.patient_id?.toString()], (oldData) =>
        oldData ? oldData.map(guidance => guidance.id === data.id ? data : guidance) : []
      );

      notify('Orientação nutricional atualizada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar orientação nutricional', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeNutritionalGuidanceSelectedPatient: async (guidanceData, queryClient) => {
    try {
      queryClient.setQueryData<NutritionalGuidanceSelectedPatient[]>(['nutritionalGuidanceSelectedPatient', guidanceData.patient_id?.toString()], (oldData) =>
        oldData ? oldData.filter(guidance => guidance.id !== guidanceData.id) : []
      );

      await api.delete(`/orientacao-nutricional-selecionada-paciente/${guidanceData.id}`);

      notify('Anamnese removida com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

});

export default useNutritionalGuidanceSelectedPatientActions;
