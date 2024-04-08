import { create } from "zustand";
import { QueryClient } from "@tanstack/react-query";
import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { AxiosError } from "axios";

export interface QualitativeMeal {
  id: number;
  name: string;
  time: string;
  content: string;
  professional_id: number;
  category: string;
}

interface MyQualitativeMealsStore {
  qualitativeMeals: QualitativeMeal[];

  getMyQualitativeMeals: () => Promise<QualitativeMeal[] | false>;
  // eslint-disable-next-line no-unused-vars
  deleteQualitativeMeal: (qualitativeMeal: QualitativeMeal, queryClient?: QueryClient) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  createQualitativeMeal: (payload: Partial<QualitativeMeal>, queryClient: QueryClient) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  updateQualitativeMeal: (payload: QualitativeMeal, queryClient: QueryClient) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  removeQualitativeMeal: (qualitativeMeal: QualitativeMeal, queryClient: QueryClient) => Promise<void>;
}

export const useMyQualitativeMealsStore = create<MyQualitativeMealsStore>((set) => ({
  qualitativeMeals: [],

  getMyQualitativeMeals: async () => {
    try {
      const { data } = await api.get<QualitativeMeal[]>("/plano-alimentar-qualitativo-modelo/professional");
      set({ qualitativeMeals: data });
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return [];
      }

      console.error(error);
      notify('Erro ao buscar modelos de refeição', 'Erro', 'close', 'danger');
      return false;
    }
  },

  deleteQualitativeMeal: async (qualitativeMeal, queryClient) => {
    try {
      await api.delete(`/plano-alimentar-qualitativo-modelo/${qualitativeMeal.id}`);
      set(state => ({ qualitativeMeals: state.qualitativeMeals.filter(t => t.id !== qualitativeMeal.id) }));

      queryClient && queryClient.setQueryData(['my-qualitative-meals'], (oldPlans: QualitativeMeal[] = []) => {
        return oldPlans.filter(plan => plan.id !== qualitativeMeal.id);
      });

      notify('Modelo de refeição deletado com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao deletar modelo de refeição', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  createQualitativeMeal: async (payload, queryClient) => {
    try {
      const { data } = await api.post('/plano-alimentar-qualitativo-modelo', payload);

      set(state => ({ qualitativeMeals: [...state.qualitativeMeals, data] }));

      queryClient && queryClient.setQueryData(['my-qualitative-meals'], (oldPlans: QualitativeMeal[] = []) => {
        return [data, ...oldPlans];
      });

      notify('Refeição adicionada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao salvar refeição', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateQualitativeMeal: async (payload, queryClient) => {
    try {
      await api.put(`/plano-alimentar-qualitativo-modelo/${payload.id}`, payload);

      set(state => ({ qualitativeMeals: state.qualitativeMeals.map(t => t.id === payload.id ? payload : t) }));

      queryClient && queryClient.setQueryData(['my-qualitative-meals'], (oldPlans: QualitativeMeal[] = []) => {
        return oldPlans.map(plan => plan.id === payload.id ? payload : plan);
      });

      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeQualitativeMeal: async (qualitativeMeal, queryClient) => {
    try {
      await api.delete(`/plano-alimentar-qualitativo-modelo/${qualitativeMeal.id}`);
      set(state => ({ qualitativeMeals: state.qualitativeMeals.filter(t => t.id !== qualitativeMeal.id) }));

      queryClient && queryClient.setQueryData(['my-qualitative-meals'], (oldPlans: QualitativeMeal[] = []) => {
        return oldPlans.filter(plan => plan.id !== qualitativeMeal.id);
      });

      notify('Modelo de refeição deletado com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao deletar modelo de refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  },
}));
