import api from "../../../../../services/useAxios";
import { HydrationAlert, HydrationAlertActions } from "./types";
import { notify } from "../../../../../components/toast/NotificationIcon";

const useHydrationAlertActions = (): HydrationAlertActions => ({
  addHydrationAlert: async (alerts, queryClient, patientToken) => {
    try {
      const { data } = await api.post<HydrationAlert[]>('/alerta-hidratacao/', { alerts: alerts.filter(a => !a.id), patientToken });

      queryClient.setQueryData<HydrationAlert[]>(['alerts', alerts[0].patient_id], (oldData) =>{
        return data.length ? (oldData ? [...oldData, ...data] : data) : oldData ?? []
      });

      notify('Alerta adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar alerta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeHydrationAlert: async (ids) => {
    try {
      await api.post("/alerta-hidratacao/delete", {
        ids
      });

      notify('Alertas removidos com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover atestado', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useHydrationAlertActions;
