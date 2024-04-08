import { create } from "zustand";
import { AnamnesisTemplate } from "../../../../Anamnesis/hooks/AnamnesisTemplateStore";

interface AnamnesisModalStore {
  selectedAnamnesis: AnamnesisTemplate | null;
  showModal: boolean;

  handleSelectAnamnesis: (meal: AnamnesisTemplate) => void;
  showAnamnesisModal: () => void;
  hideModal: () => void;
}

export const useAnamnesisModalStore = create<AnamnesisModalStore>(set => ({
  selectedAnamnesis: null,
  showModal: false,

  handleSelectAnamnesis: (selectedAnamnesis) => set({ selectedAnamnesis, showModal: true }),
  showAnamnesisModal: () => set({ showModal: true, selectedAnamnesis: null }),
  hideModal: () => set({ showModal: false, selectedAnamnesis: null }),
}))