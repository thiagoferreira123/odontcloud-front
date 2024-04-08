import { create } from "zustand";

interface CreateMicroNutrientStore {
  showMicronutrientsCard: boolean;

  // eslint-disable-next-line no-unused-vars
  setShowMicronutrientsCard: (show: boolean) => void;
}

export const useMicronutrientStore = create<CreateMicroNutrientStore>((set) => ({
  showMicronutrientsCard: false,

  setShowMicronutrientsCard: (show) =>
    set(() => ({ showMicronutrientsCard: show })),
}));