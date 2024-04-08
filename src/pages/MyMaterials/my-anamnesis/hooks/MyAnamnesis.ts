import { create } from "zustand";
import { QueryClient } from "@tanstack/react-query";
import { notify } from "../../../../components/toast/NotificationIcon";
import { AnamnesisTemplate } from "../../../Anamnesis/hooks/AnamnesisTemplateStore";
import api from "../../../../services/useAxios";

interface MyAnamnesisStore {
  qualitativeMeals: AnamnesisTemplate[];

  getMyAnamnesis: () => Promise<AnamnesisTemplate[] | false>;
  deleteAnamnesisTemplate: (qualitativeMeal: AnamnesisTemplate, queryClient?: QueryClient) => Promise<boolean>;
  createAnamnesisTemplate: (payload: Partial<AnamnesisTemplate>, queryClient: QueryClient) => Promise<boolean>;
  updateAnamnesisTemplate: (payload: AnamnesisTemplate, queryClient: QueryClient) => Promise<boolean>;
  removeAnamnesisTemplate: (qualitativeMeal: AnamnesisTemplate, queryClient: QueryClient) => Promise<void>;
}

export const useMyAnamnesisStore = create<MyAnamnesisStore>((set) => ({
  qualitativeMeals: [],

  getMyAnamnesis: async () => {
    try {
      const { data } = await api.get<AnamnesisTemplate[]>("/anamnese-modelo/professional");
      set({ qualitativeMeals: data });
      return data;
    } catch (error) {
      console.error(error);
      notify('Erro ao buscar modelos de anamnese', 'Erro', 'close', 'danger');
      return false;
    }
  },

  deleteAnamnesisTemplate: async (qualitativeMeal, queryClient) => {
    try {
      await api.delete(`/anamnese-modelo/${qualitativeMeal.id}`);
      set(state => ({ qualitativeMeals: state.qualitativeMeals.filter(t => t.id !== qualitativeMeal.id) }));

      queryClient && queryClient.setQueryData(['my-anamnesis-templates'], (oldPlans: AnamnesisTemplate[] = []) => {
        return oldPlans.filter(plan => plan.id !== qualitativeMeal.id);
      });

      notify('Modelo de anamnese deletado com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao deletar modelo de anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  createAnamnesisTemplate: async (payload, queryClient) => {
    try {
      const { data } = await api.post('/anamnese-modelo', payload);

      set(state => ({ qualitativeMeals: [...state.qualitativeMeals, data] }));

      queryClient && queryClient.setQueryData(['my-anamnesis-templates'], (oldPlans: AnamnesisTemplate[] = []) => {
        return [data, ...oldPlans];
      });

      notify('Anamnese adicionada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao salvar anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateAnamnesisTemplate: async (payload, queryClient) => {
    try {
      await api.patch(`/anamnese-modelo/${payload.id}`, payload);

      set(state => ({ qualitativeMeals: state.qualitativeMeals.map(t => t.id === payload.id ? payload : t) }));

      queryClient && queryClient.setQueryData(['my-anamnesis-templates'], (oldPlans: AnamnesisTemplate[] = []) => {
        return oldPlans.map(plan => plan.id === payload.id ? payload : plan);
      });

      notify('Anamnese atualizada com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao atualizar anamnese', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeAnamnesisTemplate: async (qualitativeMeal, queryClient) => {
    try {
      await api.delete(`/anamnese-modelo/${qualitativeMeal.id}`);
      set(state => ({ qualitativeMeals: state.qualitativeMeals.filter(t => t.id !== qualitativeMeal.id) }));

      queryClient && queryClient.setQueryData(['my-anamnesis-templates'], (oldPlans: AnamnesisTemplate[] = []) => {
        return oldPlans.filter(plan => plan.id !== qualitativeMeal.id);
      });

      notify('Modelo de anamnese deletado com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao deletar modelo de anamnese', 'Erro', 'close', 'danger');
      console.error(error);
    }
  },
}));
