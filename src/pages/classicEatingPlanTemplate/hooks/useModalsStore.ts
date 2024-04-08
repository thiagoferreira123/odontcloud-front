import { ClassicPlanMeal, ClassicPlanMealFood, ClassicPlanReplacementMeal } from "/src/types/PlanoAlimentarClassico";
import { create } from "zustand";

interface createModalsStore {
  showModalMealTemplate: boolean;
  showModalDeleteMeal: boolean;
  showModalCustomMeasurement: boolean;

  replacementMealId: number;
  baseMealId: number;
  selectedMeal: ClassicPlanMeal | null;
  selectedReplacementMeal: ClassicPlanReplacementMeal | null;
  selectedMealFood: ClassicPlanMealFood | null;

  // eslint-disable-next-line no-unused-vars
  setShowModalMealTemplate: (showModalMealTemplate: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setShowModalDeleteMeal: (showModalDeleteMeal: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setShowModalCustomMeasurement: (showModalCustomMeasurement: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setReplacementMealId: (replacementMealId: number) => void;
  // eslint-disable-next-line no-unused-vars
  setBaseMealId: (baseMealId: number) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedMeal: (selectedMeal: ClassicPlanMeal) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedReplacementMeal: (selectedReplacementMeal: ClassicPlanReplacementMeal) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedMealFood: (selectedMealFood: ClassicPlanMealFood) => void;
}

export const useModalsStore = create<createModalsStore>((set) => ({
  showModalMealTemplate: false,

  showModalDeleteMeal: false,
  showModalCustomMeasurement: false,

  replacementMealId: 0,
  baseMealId: 0,

  selectedMeal: null,
  selectedReplacementMeal: null,

  selectedMealFood: null,

  setShowModalMealTemplate: (showModalMealTemplate) =>
    set({ showModalMealTemplate }),

  setShowModalDeleteMeal: (showModalDeleteMeal) =>
    set({ showModalDeleteMeal, selectedMeal: null, selectedReplacementMeal: null, baseMealId: 0, replacementMealId: 0 }),

  setShowModalCustomMeasurement: (showModalCustomMeasurement) =>
    set({ showModalCustomMeasurement, selectedMeal: null, selectedReplacementMeal: null, baseMealId: 0, replacementMealId: 0 }),

  setReplacementMealId: (replacementMealId) => set({ replacementMealId }),
  setBaseMealId: (baseMealId) => set({ baseMealId }),
  setSelectedMeal: (selectedMeal) => set({ selectedMeal }),
  setSelectedReplacementMeal: (selectedReplacementMeal) => set({ selectedReplacementMeal }),
  setSelectedMealFood: (selectedMealFood) => set({ selectedMealFood }),
}));