import api from "../../../../../services/useAxios";
import { ClassicPlan } from "../../../../../types/PlanoAlimentarClassico";
import { createClassicPlanStore, PlanActions } from "./types";

const usePlanActions = (set: (partial: (state: createClassicPlanStore) => Partial<createClassicPlanStore>) => void) => (<PlanActions>{
  setPlans: (plans) =>
    set(() => {
      return { plans };
    }),

  addPlan: (plan, queryClient) => {
    queryClient.setQueryData(['reminders', plan.idPaciente], (plans: ClassicPlan[]) => {
      return plans ? [plan, ...plans] : [plan];
    });
  },

  updatePlan: async (plan, queryClient) => {
    try {
      await api.patch('/plano_alimentar/' + plan.id, plan);

      queryClient.setQueryData(['reminders', plan.idPaciente], (plans: ClassicPlan[]) => {
        return plans ? plans.map((p) => (p.id === plan.id ? {...p, ...plan} : p)) : [];
      });

      return true;

    } catch (error) {
      console.error(error);
      return false;
    }
  },

  removePlan: async (plan, queryClient) => {
    try {
      await api.delete('/plano_alimentar/' + plan.id);

      queryClient.setQueryData(['reminders', plan.idPaciente], (plans: ClassicPlan[]) => {
        return plans ? plans.filter((p) => p.id && p.id !== plan.id) : [];
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
})

export default usePlanActions;