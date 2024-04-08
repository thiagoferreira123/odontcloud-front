import { notify } from "../../../../components/toast/NotificationIcon";
import { parseBrDateToIso } from "../../../../helpers/DateHelper";
import api from "../../../../services/useAxios";
import { Adminpanel, AdminpanelActions } from "./types";

const useAdminpanelActions = (): AdminpanelActions => ({
  addAdminpanel: async (adminpanelData, month, year, queryClient) => {
    try {
      const { data } = await api.post<Adminpanel>('/controle-financeiro/', {
        ...adminpanelData,
        value: Number(adminpanelData.value?.replace('.', '').replace(',', '.')),
      });

      queryClient.setQueryData<Adminpanel[]>(['my-adminpanels', month, year], (oldData) => [...(oldData || []), data]);

      notify('Transação adicionada com sucesso', 'Sucesso', 'check', 'success');

      return data?.id ?? false;
    } catch (error) {
      notify('Erro ao adicionar transação', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateAdminpanel: async (adminpanelData, month, year, queryClient) => {
    try {
      const { data } = await api.patch<Adminpanel>(`/controle-financeiro/${adminpanelData.id}`, {
        ...adminpanelData,
        value: Number(adminpanelData.value?.replace('.', '').replace(',', '.')),
      });

      queryClient.setQueryData<Adminpanel[]>(['my-adminpanels', month, year], (oldData) =>
        oldData ? oldData.map(adminpanel => adminpanel.id === data.id ? data : adminpanel) : []
      );

      notify('Transação atualizada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar transação', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeAdminpanel: async (adminpanelId, month, year, queryClient) => {
    try {
      await api.delete(`/controle-financeiro/${adminpanelId}`);

      queryClient.setQueryData<Adminpanel[]>(['my-adminpanels', month, year], (oldData) =>
        oldData ? oldData.filter(adminpanel => adminpanel.id !== adminpanelId) : []
      );

      notify('Transação removida com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover transação', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useAdminpanelActions;
