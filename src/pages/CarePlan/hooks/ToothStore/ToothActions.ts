import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { CarePlan, Tooth, ToothActions } from "./types";

const useToothActions = (): ToothActions => ({

  addTooth: async (toothDetailData, queryClient) => {
    try {
      const { data } = await api.post<Tooth>('/tooth/', toothDetailData);

      queryClient.setQueryData<Tooth[]>(['tooths', toothDetailData.tooth_id], (oldData) => [...(oldData || []), data]);

      notify('Dente adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar dente', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateTooth: async (toothDetailData, queryClient) => {
    try {
      const { data } = await api.patch<Tooth>(`/tooth/${toothDetailData.tooth_id}`, toothDetailData);

      queryClient.setQueryData<Tooth[]>(['tooths', toothDetailData.tooth_id], (oldData) =>
        oldData ? oldData.map(detail => detail.tooth_id === data.tooth_id ? data : detail) : []
      );

      notify('Dente atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar dente', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeTooth: async (tooth, care_plan_id, queryClient) => {
    try {
      await api.delete(`/tooth/${tooth.tooth_id}`);

      queryClient.setQueryData<CarePlan>(['careplan', care_plan_id ], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          procedures: oldData.procedures.map(procedure => ({
            ...procedure,
            teeth: procedure.teeth.filter(detail => detail.tooth_id !== tooth.tooth_id),
          })),
        };
      });

      notify('Dente removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover dente', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useToothActions;
