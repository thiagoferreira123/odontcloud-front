import api from "../../../../../services/useAxios";
import { CarePlanDetails, CarePlanDetailsActions } from "./types"; 
import { notify } from "../../../../../components/toast/NotificationIcon";

const useCarePlanDetailsActions = (): CarePlanDetailsActions => ({
  addCarePlan: async (careplanDetailData, queryClient) => {
    try {
      const { data } = await api.post<CarePlanDetails>('/care-plan/', careplanDetailData); 

      queryClient.setQueryData<CarePlanDetails[]>(['careplans', careplanDetailData.care_plan_id], (oldData) => [...(oldData || []), data]);

      notify('Plano de atendimento criado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar plano de atendimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateCarePlan: async (careplanDetailData, queryClient) => {
    try {
      const { data } = await api.patch<CarePlanDetails>(`/care-plan/${careplanDetailData.care_plan_id}`, careplanDetailData);

      queryClient.setQueryData<CarePlanDetails[]>(['careplans', careplanDetailData.care_plan_id], (oldData) =>
        oldData ? oldData.map(detail => detail.care_plan_id === data.care_plan_id ? data : detail) : []
      );

      notify('Plano de atendimento atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar plano de atendimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeCarePlan: async (careplan, queryClient) => {
    try {
      await api.delete(`/care-plan/${careplan.care_plan_id}`); 

      queryClient.setQueryData<CarePlanDetails[]>(['careplans', careplan.care_plan_id], (oldData) =>
        oldData ? oldData.filter(detail => detail.care_plan_id !== careplan.care_plan_id) : []
      );

      notify('Plano de atendimento removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover plano de atendimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useCarePlanDetailsActions;
