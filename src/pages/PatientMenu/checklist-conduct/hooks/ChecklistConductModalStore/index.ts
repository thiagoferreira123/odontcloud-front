import { create } from "zustand";
import { ChecklistConduct } from "../ChecklistConductsStore/types";
import { ChecklistConductModalStore } from "./types";
import useConductItemActions from "./ConductItemActions";

export const useChecklistConductModalStore = create<ChecklistConductModalStore>((set) => ({
  showModal: false,
  selectedChecklistConduct: null,

  hideModal: () => {
    set({ showModal: false, selectedChecklistConduct: null });
  },

  handleSelectChecklistConductToEdit: (checkList) => {
    checkList.items = checkList.items.sort((a, b) => a.position - b.position);
    set({ selectedChecklistConduct: checkList, showModal: true });
  },

  handleShowCreateChecklistConductModal: () => {
    set({ showModal: true, selectedChecklistConduct: null });
  },

  ...useConductItemActions(set),
}));