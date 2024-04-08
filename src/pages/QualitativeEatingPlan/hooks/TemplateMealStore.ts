import { create } from "zustand";
import { notify } from "../../../components/toast/NotificationIcon";
import { QualitativeEatingPlanMeal } from "../../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types";
import api from "../../../services/useAxios";

export interface TemplateMeal {
  id: number;
  name: string;
  time: string;
  content: string;
  professional_id: number;
  category: string;
  imageUrl: string;
}

interface TemplateMealStore {
  templateMeals: TemplateMeal[];
  getTemplateMeals: () => Promise<TemplateMeal[] | false>;
  // eslint-disable-next-line no-unused-vars
  deleteTemplate: (template: TemplateMeal) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  saveMealAsTemplate: (payload: Partial<QualitativeEatingPlanMeal>) => Promise<boolean>;
}

export const useTemplateMealStore = create<TemplateMealStore>((set) => ({
  templateMeals: [],

  getTemplateMeals: async () => {
    try {
      const { data } = await api.get<TemplateMeal[]>("/plano-alimentar-qualitativo-modelo");
      set({ templateMeals: data });
      return data;
    } catch (error) {
      console.error(error);
      notify('Erro ao buscar modelos de refeição', 'Erro', 'close', 'danger');
      return false;
    }
  },

  deleteTemplate: async (template) => {
    try {
      await api.delete(`/plano-alimentar-qualitativo-modelo/${template.id}`);
      set(state => ({ templateMeals: state.templateMeals.filter(t => t.id !== template.id) }));
      notify('Modelo de refeição deletado com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao deletar modelo de refeição', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  saveMealAsTemplate: async (payload) => {
    try {
      const { data } = await api.post('/plano-alimentar-qualitativo-modelo', payload);

      set(state => ({ templateMeals: [...state.templateMeals, data] }));

      notify('Refeição salva com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao salvar refeição', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
}));
