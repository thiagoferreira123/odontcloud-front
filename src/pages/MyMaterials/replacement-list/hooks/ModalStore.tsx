import { EquivalentEatingPlanCustomList } from "/src/types/PlanoAlimentarEquivalente";
import { create } from "zustand";

interface ModalStore {
  selectedList: EquivalentEatingPlanCustomList | null;
  showDeleteConfirmation: boolean;

  // eslint-disable-next-line no-unused-vars
  setSelectedFood: (list: EquivalentEatingPlanCustomList | null) => void;
  // eslint-disable-next-line no-unused-vars
  setShowDeleteConfirmation: (show: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  handleShowDeleteConfirmationModal: (list: EquivalentEatingPlanCustomList) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  selectedList: null,
  showDeleteConfirmation: false,

  setSelectedFood: (list) => set({ selectedList: list }),
  setShowDeleteConfirmation: (show) => set({ showDeleteConfirmation: show }),
  handleShowDeleteConfirmationModal: (list) => {
    set({ selectedList: list });
    set({ showDeleteConfirmation: true });
  },
}));