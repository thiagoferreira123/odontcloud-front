import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { QualitativeEatingPlanShoppingList } from "../../../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types";
import { QualitativeEatingPlanStore, ShoppingListState } from "./types";

// eslint-disable-next-line no-unused-vars
const useShoppingListState = (set: (partial: (state: QualitativeEatingPlanStore) => Partial<QualitativeEatingPlanStore>) => void) => (<ShoppingListState>{
  addShoppingList: async (payload) => {
    try {
      const { data } = await api.post<QualitativeEatingPlanShoppingList>("/plano-alimentar-qualitativo-lista-compra/", payload);

      set(() => {
        return { shoppingList: data };
      });

      notify("Lista de compras adicionada com sucesso", "Sucesso", "check", "success");

      return true;
    } catch (error) {
      notify('Erro ao adicionar lista de compras', 'close', 'danger');
      return false;
    }
  },

  updateShoppingList: async (shoppingList) => {
    try {
      set((state) => {
        return state.shoppingList ? { shoppingList: { ...state.shoppingList, ...shoppingList } } : state;
      });

      await api.put("/plano-alimentar-qualitativo-lista-compra/" + shoppingList.id, shoppingList);

      notify("Lista de compras atualizada com sucesso", "Sucesso", "check", "success");
      return true;
    } catch (error) {
      notify('Erro ao atualizar lista de compras', 'close', 'danger');
      return false;
    }
  },

  removeQualitativeEatingPlanShoppingList: async (shoppingList) => {
    try {
      set(() => ({ shoppingList: null }));

      await api.delete("/plano-alimentar-qualitativo-lista-compra/" + shoppingList.id);

      notify("Lista de compras removida com sucesso", "Sucesso", "check", "success");
      return true;
    } catch (error) {
      console.error(error);
      notify("Erro ao remover refeição", "close", "danger");
    }
  },
});

export default useShoppingListState;
