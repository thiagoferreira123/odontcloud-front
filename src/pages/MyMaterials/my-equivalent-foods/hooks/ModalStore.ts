import { PersonalEquivalentFood } from "/src/types/Food";
import { create } from "zustand";

interface ModalStore {
  selectedFood: PersonalEquivalentFood | null;
  showDeleteConfirmation: boolean;

  // eslint-disable-next-line no-unused-vars
  setSelectedFood: (food: PersonalEquivalentFood | null) => void;
  // eslint-disable-next-line no-unused-vars
  setShowDeleteConfirmation: (show: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  selectedFood: null,
  showDeleteConfirmation: false,

  setSelectedFood: (food) => set({ selectedFood: food }),
  setShowDeleteConfirmation: (show) => set({ showDeleteConfirmation: show }),
}));