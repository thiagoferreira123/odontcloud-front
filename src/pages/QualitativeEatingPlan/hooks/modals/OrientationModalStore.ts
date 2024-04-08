import { create } from "zustand";

interface OrientationModalStore {
  showModal: boolean;

  showOrientationModal: () => void;
  closeModal: () => void;
}

export const useOrientationModalStore = create<OrientationModalStore>(set => ({
  selectedMeal: null,
  showModal: false,

  showOrientationModal: () => set({ showModal: true }),
  closeModal: () => set({ showModal: false }),
}))