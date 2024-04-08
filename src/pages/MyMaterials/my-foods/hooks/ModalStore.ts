import { Food } from "/src/types/foods";
import { create } from "zustand";

interface ModalStore {
  selectedFood: Food | null;
  showDeleteConfirmation: boolean;

  // eslint-disable-next-line no-unused-vars
  setSelectedFood: (food: Food | null) => void;
  // eslint-disable-next-line no-unused-vars
  setShowDeleteConfirmation: (show: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  selectedFood: null,
  showDeleteConfirmation: false,

  setSelectedFood: (food) => set({ selectedFood: food }),
  setShowDeleteConfirmation: (show) => set({ showDeleteConfirmation: show }),
}));