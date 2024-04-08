import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { QualitativeEatingPlanMeal } from "../../../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types";
import { QualitativeEatingPlanMealState, QualitativeEatingPlanStore } from "./types";

// eslint-disable-next-line no-unused-vars
const useQualitativeEatingPlanMealState = (set: (partial: (state: QualitativeEatingPlanStore) => Partial<QualitativeEatingPlanStore>) => void) => (<QualitativeEatingPlanMealState>{
  setQualitativeEatingPlanMeals: (meals) => {
    set(() => ({ qualitativeEatingPlanMeals: meals }));
  },
  updateMeal: (meal) => {
    set((state) => {
      return { qualitativeEatingPlanMeals: state.qualitativeEatingPlanMeals.map((qualitativeEatingPlanMeal) => qualitativeEatingPlanMeal.id === meal.id ? { ...qualitativeEatingPlanMeal, ...meal } : qualitativeEatingPlanMeal) }
    });
  },

  removeQualitativeEatingPlanMeal: async (meal) => {
    try {
      set(state => ({ qualitativeEatingPlanMeals: state.qualitativeEatingPlanMeals.filter(m => m.id !== meal.id) }));

      await api.delete<QualitativeEatingPlanMeal>("/plano-alimentar-qualitativo-refeicao/" + meal.id);

      return true;
    } catch (error) {
      console.error(error);
      notify("Erro ao remover refeição", "close", "danger");
    }
  },

  updateMealCommentQualitativeEatingPlanMeal: async (mealId, comment) => {
    try {
      await api.patch(`/plano-alimentar-qualitativo-historico/${mealId}`, { comment });

      set((state) => ({
        qualitativeEatingPlanMeals: state.qualitativeEatingPlanMeals.map((meal) =>
          meal.id === mealId ? { ...meal, comment } : meal
        ),
      }));
      notify("Comentário da refeição atualizado com sucesso", "Sucesso", "check", "success");
    } catch (error) {
      console.error(error);
      notify("Erro ao atualizar comentário da refeição", "Erro", "close", "danger");
    }
  },

  cloneMeal: async (mealId) => {
    try {
      const { data } = await api.get("/plano-alimentar-qualitativo-refeicao/clone/" + mealId);

      set(state => {
        return { qualitativeEatingPlanMeals: [...state.qualitativeEatingPlanMeals, data] }
      });

      notify("Refeição duplicada com sucesso", "Sucesso", "check", "success");

      return true;
    } catch (error) {
      notify('Erro ao clonar refeição', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useQualitativeEatingPlanMealState;
