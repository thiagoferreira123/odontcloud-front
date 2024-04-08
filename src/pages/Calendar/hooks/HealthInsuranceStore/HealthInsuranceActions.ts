import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { HealthInsurance, HealthInsuranceActions } from "./types";

const useHealthInsuranceActions = (): HealthInsuranceActions => ({
  addHealthInsurance: async (healthInsuranceData, queryClient) => {
    try {
      const { data } = await api.post<HealthInsurance>('/agenda-convenio/', healthInsuranceData);

      queryClient.setQueryData<HealthInsurance[]>(['health-insurances'], (oldData) => [...(oldData || []), data]);

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar histórico de agendamento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useHealthInsuranceActions;
