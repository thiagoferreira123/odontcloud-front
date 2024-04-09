import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { ClinicProcedure, ClinicProcedureActions } from "./types";

const useClinicProcedureActions = (): ClinicProcedureActions => ({
  addClinicProcedure: async (payload, queryClient) => {
    try {
      const { data } = await api.post<ClinicProcedure>('/clinic-procedure/', payload);

      queryClient.setQueryData<ClinicProcedure[]>(['clinic_procedures'], (oldData) => [...(oldData || []), data]);

      notify('Procedimento adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar procedimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateClinicProcedure: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<ClinicProcedure>(`/clinic-procedure/${payload.clinic_procedure_id}`, payload);

      queryClient.setQueryData<ClinicProcedure[]>(['clinic_procedures'], (oldData) =>
        oldData ? oldData.map(p => p.clinic_procedure_id === data.clinic_procedure_id ? data : p) : []
      );

      notify('Procedimento atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar procedimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeClinicProcedure: async (certificate, queryClient) => {
    try {
      await api.delete(`/clinic-procedure/${certificate.clinic_procedure_id}`);

      queryClient.setQueryData<ClinicProcedure[]>(['clinic_procedures'], (oldData) =>
        oldData ? oldData.filter(p => p.clinic_procedure_id !== certificate.clinic_procedure_id) : []
      );

      notify('Procedimento removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover procedimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useClinicProcedureActions;
