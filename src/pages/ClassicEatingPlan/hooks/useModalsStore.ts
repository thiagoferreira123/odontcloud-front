import { create } from "zustand";
import { ClassicPlanMeal, ClassicPlanMealFood, ClassicPlanReplacementMeal, ClassicPlanReplacementMealFood } from "../../../types/PlanoAlimentarClassico";

interface createModalsStore {
  showModalMealTemplate: boolean;
  showModalDeleteMeal: boolean;
  showModalCustomMeasurement: boolean;
  showModalSelectPDF: boolean;
  showModalSendPDF: boolean;

  replacementMealId: number;
  baseMealId: number;
  selectedMeal: ClassicPlanMeal | null;
  selectedReplacementMeal: ClassicPlanReplacementMeal | null;
  selectedMealFood: ClassicPlanMealFood | null;
  selectedReplacementMealFood: ClassicPlanReplacementMealFood | null;

  // eslint-disable-next-line no-unused-vars
  setShowModalMealTemplate: (showModalMealTemplate: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setShowModalSendPDF: (show: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setShowModalDeleteMeal: (showModalDeleteMeal: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setShowModalCustomMeasurement: (showModalCustomMeasurement: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setShowModalSelectPDF: (showModalSelectPDF: boolean) => void;
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
  setSelectedReplacementMealFood: (selectedReplacementMealFood: ClassicPlanReplacementMealFood, mealId: number) => void;
}

export const useModalsStore = create<createModalsStore>((set) => ({
  showModalMealTemplate: false,

  showModalDeleteMeal: false,
  showModalCustomMeasurement: false,
  showModalSendPDF: false,
  showModalSelectPDF: false,

  replacementMealId: 0,
  baseMealId: 0,

  selectedMeal: null,
  selectedReplacementMeal: null,

  selectedMealFood: null,
  selectedReplacementMealFood: null,

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
  setShowModalSendPDF: (show: boolean) =>
    set(() => {
      return { showModalSendPDF: show };
    }),
  setShowModalSelectPDF: (showModalSelectPDF) => set({ showModalSelectPDF }),
  setSelectedReplacementMealFood: (selectedReplacementMealFood, baseMealId) => set({ selectedReplacementMealFood, baseMealId }),
}));