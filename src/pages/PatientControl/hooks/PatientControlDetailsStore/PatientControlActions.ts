import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { Patient } from "../../../../types/Patient";
import { PatientActions } from "./types";

const usePatientActions = (): PatientActions => ({
  addPatientControl: async (patientDetailData, queryClient) => {
    try {
      const { data } = await api.post<Patient>('/paciente/', patientDetailData);

      queryClient.setQueryData<Patient[]>(['attendances', patientDetailData.id], (oldData) => [...(oldData || []), data]);

      notify('Paciente adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar paciente', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updatePatientControl: async (patientDetailData, queryClient) => {
    try {
      const { data } = await api.patch<Patient>(`/paciente/${patientDetailData.id}`, patientDetailData);

      queryClient.setQueryData<Patient[]>(['attendances', patientDetailData.id], (oldData) =>
        oldData ? oldData.map(detail => detail.id === data.id ? data : detail) : []
      );

      notify('Paciente atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar paciente', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removePatientControl: async (PatientControl, queryClient) => {
    try {
      await api.delete(`/paciente/${PatientControl.id}`);

      queryClient.setQueryData<Patient[]>(['attendances', PatientControl.id], (oldData) =>
        oldData ? oldData.filter(detail => detail.id !== PatientControl.id) : []
      );

      notify('Paciente removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover paciente', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default usePatientActions;
