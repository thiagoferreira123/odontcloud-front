import { create } from "zustand";
import { Tooth } from "./CarePlanStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedTooth: Tooth | null;

  handleSelectToothToRemove: (careplan: Tooth, care_plan_id: string) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedTooth: null,

  handleSelectToothToRemove(careplan) {
    set({ selectedTooth: careplan, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedTooth: null });
  },
}));