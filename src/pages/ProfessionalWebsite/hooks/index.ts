import { create } from 'zustand';
import { ProfessionalSite, ProfessionalSiteStore } from './types';
import { AxiosError } from 'axios';
import useProfessionalSiteActions from './ProfessionalWebsiteActions';
import api from '../../../services/useAxios';

const useProfessionalSiteStore = create<ProfessionalSiteStore>((set) => ({
  getSite: async () => {
    try {
      const { data } = await api.get<ProfessionalSite>("/profissional-website/professional");
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return {} as ProfessionalSite;
      }

      console.error(error);
      return false;
    }
  },

  getSiteByUrl: async (url: string) => {
    try {
      const { data } = await api.get<ProfessionalSite>(`/profissional-website/url/${url}`);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return {} as ProfessionalSite;
      }

      console.error(error);
      return false;
    }
  },

  ...useProfessionalSiteActions()
}));

export default useProfessionalSiteStore;
