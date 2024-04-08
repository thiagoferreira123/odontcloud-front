import { create } from "zustand";
import { ChecklistConductTemplate, ChecklistConductTemplateItem } from "../../../PatientMenu/checklist-conduct/hooks/ChecklistConductTemplatesStore/types";
import { notify } from "../../../../components/toast/NotificationIcon";

interface ChecklistConductModalStore {
  selectedChecklistConduct: ChecklistConductTemplate | null;
  showModal: boolean;

  handleSelectChecklistConduct: (meal: ChecklistConductTemplate) => void;
  showChecklistConductModal: () => void;
  addConductItem: (item: ChecklistConductTemplateItem) => boolean;
  updateConductItem: (item: ChecklistConductTemplateItem) => boolean;
  removeConductItem: (item: ChecklistConductTemplateItem) => boolean;
  setItems: (items: ChecklistConductTemplateItem[]) => void;
  hideModal: () => void;
}

export const useChecklistConductModalStore = create<ChecklistConductModalStore>(set => ({
  selectedChecklistConduct: null,
  showModal: false,

  handleSelectChecklistConduct: (selectedChecklistConduct) => set({ selectedChecklistConduct, showModal: true }),
  showChecklistConductModal: () => set({ showModal: true, selectedChecklistConduct: null }),
  hideModal: () => set({ showModal: false, selectedChecklistConduct: null }),
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
}))