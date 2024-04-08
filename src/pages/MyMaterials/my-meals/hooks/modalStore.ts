import { parseFloatNumber } from "/src/helpers/MathHelpers";
import { ClassicPlanMealTemplate, ClassicPlanMealTemplateFood } from "/src/types/PlanoAlimentarClassico";
import { create } from "zustand";

interface ModalStore {
  showModalModal: boolean;
  selectedMeal: ClassicPlanMealTemplate | null;
  // eslint-disable-next-line no-unused-vars
  setShowMealModal: (modal: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectMeal: (meal: ClassicPlanMealTemplate) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectMeal: (meal: ClassicPlanMealTemplate) => void;
  // eslint-disable-next-line no-unused-vars
  buildMealMacros: () => void;
  // eslint-disable-next-line no-unused-vars
  addSelectedMealFood: (food: ClassicPlanMealTemplateFood) => void;
  // eslint-disable-next-line no-unused-vars
  removerSelectedMealFood: (food: ClassicPlanMealTemplateFood) => void;
  // eslint-disable-next-line no-unused-vars
  updateSelectedMealFood: (food: Partial<ClassicPlanMealTemplateFood>) => void;
  // eslint-disable-next-line no-unused-vars
  updateSelectedMealFoodMacros: (food: Partial<ClassicPlanMealTemplateFood>) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  showModalModal: false,
  selectedMeal: null,

  setShowMealModal: (modal) => set(() => ({ showModalModal: modal })),

  handleSelectMeal: (meal) => set(() => ({ showModalModal: true, selectedMeal: meal })),

  setSelectMeal: (meal) => set(() => ({ selectedMeal: meal })),

  buildMealMacros() {
    set((state) => {

      if(!state.selectedMeal) return state;

      const macros =  {
        gramas: state.selectedMeal.alimentos?.reduce((acc, food) => acc + parseFloatNumber(food.gramas), 0),
        carboidratos: state.selectedMeal.alimentos?.reduce((acc, food) => acc + parseFloatNumber(Number(food.carbohydrate ?? 0)), 0),
        proteinas: state.selectedMeal.alimentos?.reduce((acc, food) => acc + parseFloatNumber(Number(food.protein ?? 0)), 0),
        lipideos: state.selectedMeal.alimentos?.reduce((acc, food) => acc + parseFloatNumber(Number(food.lipid ?? 0)), 0),
        kcal: state.selectedMeal.alimentos?.reduce((acc, food) => acc + parseFloatNumber(Number(food.calories ?? 0)), 0),
      }

      return { selectedMeal: { ...state.selectedMeal, ...macros } }
    });
  },

  addSelectedMealFood: (food) => set((state) => {
    if (state.selectedMeal) {
      return {
        selectedMeal: {
          ...state.selectedMeal,
          alimentos: [...state.selectedMeal.alimentos, food],
        },
      };
    }
    return state;
  }),

  removerSelectedMealFood: (food) => set((state) => {
    if (!state.selectedMeal) return state;

    const alimentos = state.selectedMeal.alimentos.filter((actualFood) => actualFood.id !== food.id);

    return { selectedMeal: { ...state.selectedMeal, alimentos } };
  }),

  updateSelectedMealFood: (food) => {
    set((state) => {
      if (!state.selectedMeal) return state;

      const alimentos = state.selectedMeal.alimentos.map((actualFood) => {
        if (actualFood.id === food.id) {
          return { ...actualFood, ...food };
        }
        return actualFood;
      });

      return { selectedMeal: { ...state.selectedMeal, alimentos } };
    });
  },

  updateSelectedMealFoodMacros: (food) => {
    set((state) => {
      if (!state.selectedMeal) return state;

      const alimentos = state.selectedMeal.alimentos.map((actualFood) => {
        if (actualFood.id === food.id) {

          if (!food.food || !food.measure) return actualFood;

          const gramas = food.measure.gramas * Number(food.quantidade_medida);

          const payload = {
            gramas,
            carbohydrate: parseFloatNumber((Number(food.food?.carboidrato) * Number(gramas)) / 100).toString(),
            protein: parseFloatNumber((Number(food.food?.proteina) * Number(gramas)) / 100).toString(),
            lipid: parseFloatNumber((Number(food.food?.lipideos) * Number(gramas)) / 100).toString(),
            calories: parseFloatNumber((Number(food.food?.energia) * Number(gramas)) / 100).toString(),
          };

          return { ...actualFood, ...payload };
        }
        return actualFood;
      });

      return { selectedMeal: { ...state.selectedMeal, alimentos } };
    });
  },
}));