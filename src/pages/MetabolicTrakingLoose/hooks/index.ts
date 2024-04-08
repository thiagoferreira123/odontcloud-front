import { create } from "zustand";
import api from "../../../services/useAxios";
import { AxiosError } from "axios";
import { QueryClient } from "@tanstack/react-query";
import { MetabolicTracking } from "../../MetabolicTrakingLooseResponse/hooks/types";
import { notify } from "../../../components/toast/NotificationIcon";

interface MetabolicTrakingLooseStore {
 getMetabolicTrakingLooses: () => Promise<MetabolicTracking[] | false>;
 createMetabolicTrakingLoose: (queryClient: QueryClient) => Promise<MetabolicTracking | false>;
 removeMetabolicTracking: (patientDetailData: MetabolicTracking, queryClient: QueryClient) => Promise<boolean>;
}

export const useMetabolicTrakingLooseStore = create<MetabolicTrakingLooseStore>((set, get) => ({
  getMetabolicTrakingLooses: async () => {
    try {
      const { data } = await api.get<MetabolicTracking[]>('/rastreamemto-metabolico/professional');

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  createMetabolicTrakingLoose: async (queryClient) => {
    try {
      const { data } = await api.post<MetabolicTracking>('/rastreamemto-metabolico/k/');

      queryClient.setQueryData<MetabolicTracking[]>(['metabolic-tracking-loose'], (oldData) => {
        if (!oldData) return [data];

        return [...oldData, {...data}];
      });

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  removeMetabolicTracking: async (metabolicTracking, queryClient) => {
    try {
      await api.delete(`/rastreamemto-metabolico/${metabolicTracking.id}`);

      queryClient.setQueryData<MetabolicTracking[]>(['metabolic-tracking-loose'], (oldData) =>
        oldData ? oldData.filter(detail => detail.id !== metabolicTracking.id) : []
      );

      notify('Rastreamento metabólico removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover rastreamento metabólico', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
}));