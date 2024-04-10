import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { CarePlan, Procedure, ProcedureActions } from "./types";

const useProcedureActions = (): ProcedureActions => ({

  addProcedure: async (payload, queryClient) => {
    try {
      const { data } = await api.post<Procedure>('/procedure/', payload);

      queryClient.setQueryData<CarePlan>(['careplan', payload.procedure_care_plan_id ], (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            procedures: [...oldData.procedures, data],
          };
        }
      });

      notify('Procedimento adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar procedimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateProcedure: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<Procedure>(`/procedure/${payload.procedure_id }`, payload);

      queryClient.setQueryData<CarePlan>(['careplan', payload.procedure_care_plan_id ], (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            procedures: oldData.procedures.map(detail => detail.procedure_id  === payload.procedure_id  ? data : detail),
          };
        }
      });

      notify('Procedimento atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar procedimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeProcedure: async (procedure, queryClient) => {
    try {
      await api.delete(`/procedure/${procedure.procedure_id }`);

      queryClient.setQueryData<CarePlan>(['careplan', procedure.procedure_care_plan_id ], (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            procedures: oldData.procedures.filter(detail => detail.procedure_id  !== procedure.procedure_id ),
          };
        }
      });

      notify('Procedimento removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover procedimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useProcedureActions;
