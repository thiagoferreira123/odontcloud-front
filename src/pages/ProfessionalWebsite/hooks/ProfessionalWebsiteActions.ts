import { notify } from "../../../components/toast/NotificationIcon";
import api from "../../../services/useAxios";
import { ProfessionalSite, ProfessionalSiteActions } from "./types";

const useProfessionalSiteActions = (): ProfessionalSiteActions => ({
  addSite: async (siteData, queryClient) => {
    try {
      const { data } = await api.post<ProfessionalSite>('/profissional-website/', siteData);

      queryClient.setQueryData<ProfessionalSite[]>(['sites', siteData.professional], (oldData) => [...(oldData || []), data]);

      notify('Site adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data?.id ?? false;
    } catch (error) {
      notify('Erro ao adicionar site', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateSite: async (siteData, queryClient) => {
    try {
      const { data } = await api.patch<ProfessionalSite>(`/profissional-website/${siteData.id}`, siteData);

      queryClient.setQueryData<ProfessionalSite[]>(['sites', siteData.professional], (oldData) =>
        oldData ? oldData.map(site => site.id === data.id ? data : site) : []
      );

      notify('Site atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar site', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeSite: async (siteId, queryClient) => {
    try {
      await api.delete(`/profissional-website/${siteId}`);

      queryClient.invalidateQueries({
        queryKey: ['sites'],
      });

      notify('Site removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover site', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

});

export default useProfessionalSiteActions;
