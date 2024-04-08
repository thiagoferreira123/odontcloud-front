import { create } from 'zustand';
import { Food, FoodGroup, NutrientInput } from '../../../../types/foods';
import api from '../../../../services/useAxios';

interface EditCustomFoodModalStore {

  selectedFood: Food | null;
  foodGroups: FoodGroup[];

  showEditCustomFoodModal: boolean;
  // eslint-disable-next-line no-unused-vars
  setSelectedFood: (food: Food) => void;
  getFoodGroups: () => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  updateSelectedFood: (food: Partial<Food>) => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectFood: (food: Food) => void;
  // eslint-disable-next-line no-unused-vars
  setShowEditCustomFoodModal: (show: boolean) => void;
}

const revertValues = (food: Food) => {
  const calculations: NutrientInput = {
    energia: 0,
    proteina: 0,
    lipideos: 0,
    carboidrato: 0,
    fibraAlimentar: 0,
    calcio: 0,
    magnesio: 0,
    manganes: 0,
    fosforo: 0,
    ferro: 0,
    sodio: 0,
    potassio: 0,
    cobre: 0,
    zinco: 0,
    selenio: 0,
    retinol: 0,
    vitaminaAEquivalenteDeAtividadeDeRetinol: 0,
    tiaminaVitaminaB1: 0,
    riboflavinaVitaminaB2: 0,
    niacinaVitaminaB3: 0,
    equivalenteDeNiacinaVitaminaB3: 0,
    piridoxinaVitaminaB6: 0,
    cobalaminaVitaminaB12: 0,
    vitaminaDCalciferol: 0,
    vitaminaETotalDeAlphaTocopherol: 0,
    vitaminaC: 0,
    colesterol: 0,
    acidosGraxosSaturados: 0,
    acidosGraxosMonoinsaturados: 0,
    acidosGraxosPoliinsaturados: 0,
    acidosGraxosTransTotal: 0,
  };

  for (const key in calculations) {
    if (Object.prototype.hasOwnProperty.call(calculations, key)) {
      food[key] = (Number(food[key]) * Number(food.gramas1)) / 100;
    }
  }

  return food;
};

export const useEditCustomFoodModalStore = create<EditCustomFoodModalStore>((set) => ({
  selectedFood: null,
  showEditCustomFoodModal: false,
  foodGroups: [],

  setSelectedFood: (food: Food) => set(() => ({ selectedFood: food })),

  getFoodGroups: async () => {
    try {
      const { data } = await api.get<FoodGroup[]>('/grupo-alimento');

      set(() => ({ foodGroups: data }));

      return;
    } catch (error) {
      console.error(error);
    }
  },

  updateSelectedFood: (food) => {
    set((state) => {
      if (!state.selectedFood) return state;

      return { selectedFood: { ...state.selectedFood, ...food } };
    });
  },

  handleSelectFood: (food: Food) => {
    const selectedFood = revertValues({...food});

    set(() => {
      return { selectedFood, showEditCustomFoodModal: true };
    });
  },

  setShowEditCustomFoodModal: (show: boolean) => set(() => ({ showEditCustomFoodModal: show })),
}));
