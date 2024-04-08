import { notify } from "../../../../../components/toast/NotificationIcon";
import { ChecklistConductModalStore, ConductItemActions } from "./types";

const useConductItemActions = (set: (partial: (state: ChecklistConductModalStore) => Partial<ChecklistConductModalStore>) => void) => (<ConductItemActions>{
  addConductItem: (item) => {
    try {

      set((state) => {
        if (!state.selectedChecklistConduct) return state;
        state.selectedChecklistConduct.items.push(item);
        return state;
      });

      return true
    } catch (error) {
      notify('Erro ao adicionar item', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
  updateConductItem: (item) => {
    try {
      set((state) => {
        if (!state.selectedChecklistConduct) return state;
        const index = state.selectedChecklistConduct.items.findIndex((i) => i.position === item.position);
        state.selectedChecklistConduct.items[index] = item;
        return state;
      });

      return true;
    } catch (error) {
      notify('Erro ao atualizar item', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
  removeConductItem: (item) => {
    try {
      set((state) => {
        if (!state.selectedChecklistConduct) return state;
        state.selectedChecklistConduct.items = state.selectedChecklistConduct.items.filter((i) => i.position !== item.position);
        return state;
      });

      return true;
    } catch (error) {
      notify('Erro ao remover item', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
  setItems: (items) => {
    set((state) => {
      if (!state.selectedChecklistConduct) return state;
      state.selectedChecklistConduct.items = items;
      return state;
    });
  }
});

export default useConductItemActions;
