import api from "../../../../../services/useAxios";
import { ProcedureDetails, ProcedureDetailsActions } from "./types"; 
import { notify } from "../../../../../components/toast/NotificationIcon";

const useProcedureDetailsActions = (): ProcedureDetailsActions => ({
  
  addProcedure: async (procedureDetailData, queryClient) => {
    try {
      const { data } = await api.post<ProcedureDetails>('/procedure/', procedureDetailData); 

      queryClient.setQueryData<ProcedureDetails[]>(['procedures', procedureDetailData.procedure_id ], (oldData) => [...(oldData || []), data]);

      notify('Procedimento adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar procedimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateProcedure: async (procedureDetailData, queryClient) => {
    try {
      const { data } = await api.patch<ProcedureDetails>(`/procedure/${procedureDetailData.procedure_id }`, procedureDetailData);

      queryClient.setQueryData<ProcedureDetails[]>(['procedures', procedureDetailData.procedure_id ], (oldData) =>
        oldData ? oldData.map(detail => detail.procedure_id  === data.procedure_id  ? data : detail) : []
      );

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

      queryClient.setQueryData<ProcedureDetails[]>(['procedures', procedure.procedure_id ], (oldData) =>
        oldData ? oldData.filter(detail => detail.procedure_id  !== procedure.procedure_id ) : []
      );

      notify('Procedimento removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover procedimento', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useProcedureDetailsActions;
