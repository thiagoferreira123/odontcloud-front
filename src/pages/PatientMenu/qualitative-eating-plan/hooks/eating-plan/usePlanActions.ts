import { notify } from "../../../../../components/toast/NotificationIcon";
import api from "../../../../../services/useAxios";
import { PlanActions, QualitativeEatingPlan } from "./types";

const usePlanActions = (): PlanActions => ({

  addPlan: async (qualitativeEatingPlan: Partial<QualitativeEatingPlan>, queryClient) => {
    try {
      const { data } = await api.post<QualitativeEatingPlan>('/plano-alimentar-qualitativo-historico', qualitativeEatingPlan);
      queryClient.setQueryData(['qualitative-eating-plans', qualitativeEatingPlan.patient_id], (oldPlans: QualitativeEatingPlan[] = []) => [data, ...oldPlans]);
      notify('Plano alimentar qualitativo adicionado com sucesso', 'Sucesso', 'check', 'success');
      return data?.id ?? false;
    } catch (error) {
      notify('Erro ao adicionar plano alimentar qualitativo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updatePlan: async (qualitativeEatingPlan, queryClient, ignoreNotify) => {
    try {
      const { data } = await api.patch<QualitativeEatingPlan>(`/plano-alimentar-qualitativo-historico/${qualitativeEatingPlan.id}`, qualitativeEatingPlan);
      queryClient.setQueryData(['qualitative-eating-plans', qualitativeEatingPlan.patient_id], (oldPlans: QualitativeEatingPlan[] = []) => {
        return oldPlans.map(plan => plan.id === data.id ? data : plan);
      });
      !ignoreNotify && notify('Plano alimentar qualitativo atualizado com sucesso', 'Sucesso', 'check', 'success');
      return data ? true : false;
    } catch (error) {
      !ignoreNotify && notify('Erro ao atualizar plano alimentar qualitativo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removePlan: async (qualitativeEatingPlan, queryClient) => {
    try {
      await api.delete(`/plano-alimentar-qualitativo-historico/${qualitativeEatingPlan.id}`);
      // Remove o plano específico do cache
      queryClient.setQueryData(['qualitative-eating-plans', qualitativeEatingPlan.patient_id], (oldPlans: QualitativeEatingPlan[] = []) => {
        return oldPlans.filter(plan => plan.id !== qualitativeEatingPlan.id);
      });
      notify('Plano alimentar qualitativo removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover plano alimentar qualitativo', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  clone: async (qualitativeEatingPlan, queryClient) => {
    try {
      const { data } = await api.get<QualitativeEatingPlan>(`/plano-alimentar-qualitativo-historico/clone/${qualitativeEatingPlan.id}`);
      queryClient.setQueryData(['qualitative-eating-plans', qualitativeEatingPlan.patient_id], (oldPlans: QualitativeEatingPlan[] = []) => [data, ...oldPlans]);
      notify('Plano alimentar qualitativo clonado com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      console.error(error);
      notify('Erro ao clonar plano alimentar qualitativo', 'Erro', 'close', 'danger');
      return false;
    }
  },
});

export default usePlanActions;
