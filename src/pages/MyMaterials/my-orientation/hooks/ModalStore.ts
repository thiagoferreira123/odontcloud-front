import { OrientationTemplate } from "/src/types/PlanoAlimentarClassico";
import { create } from "zustand";

interface ModalStore {
  selectedOrientation: OrientationTemplate | null;
  showDeleteConfirmation: boolean;

  // eslint-disable-next-line no-unused-vars
  setSelectedOrientation: (food: OrientationTemplate | null) => void;
  // eslint-disable-next-line no-unused-vars
  setShowDeleteConfirmation: (show: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  handleShowDeleteConfirmationModal: (food: OrientationTemplate) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  selectedOrientation: null,
  showDeleteConfirmation: false,

  setSelectedOrientation: (food) => set({ selectedOrientation: food }),
  setShowDeleteConfirmation: (show) => set({ showDeleteConfirmation: show }),
  handleShowDeleteConfirmationModal: (orientation) => set({ showDeleteConfirmation: true, selectedOrientation: orientation}),
}));