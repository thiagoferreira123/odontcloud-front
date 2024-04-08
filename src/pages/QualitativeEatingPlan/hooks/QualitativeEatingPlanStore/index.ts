import { create } from "zustand";
import { QualitativeEatingPlan, QualitativeEatingPlanMeal } from "../../../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types";
import { htmlToPlainText } from "../../../../helpers/InputHelpers";
import { notify } from "../../../../components/toast/NotificationIcon";
import { QualitativeEatingPlanStore } from "./types";
import useQualitativeEatingPlanMealState from "./QualitativeEatingPlanMealState";
import useShoppingListState from "./ShoppingListState";
import api from "../../../../services/useAxios";

export const useQualitativeEatingPlanStore = create<QualitativeEatingPlanStore>((set) => ({
  qualitativeEatingPlanMeals: [],
  patient: null,
  shoppingList: null,
  orientation: '',

  getQualitativeEatingPlan: async (id) => {
    try {
      const { data } = await api.get<QualitativeEatingPlan>(`/plano-alimentar-qualitativo-historico/${id}`);

      const qualitativeEatingPlanMeals: QualitativeEatingPlanMeal[] = data.meals.sort((a, b) => {
        const posicaoA = a.ordem ? a.ordem.posicao : 0;
        const posicaoB = b.ordem ? b.ordem.posicao : 0;
        return posicaoA - posicaoB;
      });

      set({ qualitativeEatingPlanMeals, shoppingList: data.shoppingList, orientation: data.orientation });

      return data;
    } catch (error) {
      console.error(error)
      return false;
    }
  },

  updateOrientation: async (orientation) => {
    try {
      set({ orientation });
      return true;
    } catch (error) {
      return false;
    }
  },

  handleSubmitMeals: async (id, qualitativeEatingPlanMeals) => {
    try {
      await api.put<QualitativeEatingPlanMeal>("/plano-alimentar-qualitativo-refeicao/updateMeals", qualitativeEatingPlanMeals);
      return;
    } catch (error) {
      console.error(error);
      notify("Erro ao selecionar template de refeição", "close", "danger");
    }
  },

  handleSelectTemplateMeal: async (templateMeal) => {
    try {
      const payload: Partial<QualitativeEatingPlanMeal> = {
        name: templateMeal.name,
        time: templateMeal.time,
        content: htmlToPlainText(templateMeal.content),
        qualitativePlanId: templateMeal.qualitativePlanId,
        imageUrl: templateMeal.imageUrl,
        comment: "",
        commentHtml: "",
      };

      const { data } = await api.post<QualitativeEatingPlanMeal>("/plano-alimentar-qualitativo-refeicao/", payload);

      set(state => {
        return { qualitativeEatingPlanMeals: [...state.qualitativeEatingPlanMeals, data] }
      });
    } catch (error) {
      console.error(error);
      notify("Erro ao selecionar template de refeição", "close", "danger");
    }
  },

  addMeal: async (qualitativePlanId) => {

    const payload: Partial<QualitativeEatingPlanMeal> = {
      name: "",
      time: "",
      content: "",
      comment: "",
      commentHtml: "",
      qualitativePlanId: qualitativePlanId,
      imageUrl: ""
    };

    const { data } = await api.post<QualitativeEatingPlanMeal>("/plano-alimentar-qualitativo-refeicao/", payload);

    set(state => {
      return { qualitativeEatingPlanMeals: [...state.qualitativeEatingPlanMeals, data] }
    });
  },

  ...useQualitativeEatingPlanMealState(set),
  ...useShoppingListState(set)
}));
