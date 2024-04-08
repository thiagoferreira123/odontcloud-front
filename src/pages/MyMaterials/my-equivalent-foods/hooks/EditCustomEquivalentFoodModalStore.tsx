import { create } from 'zustand';
import { FoodGroup } from '/src/types/foods';
import api from '/src/services/useAxios';
import { PersonalEquivalentFood } from '/src/types/Food';

interface EditCustomEquivalentFoodModalStore {

  selectedFood: PersonalEquivalentFood | null;
  foodGroups: FoodGroup[];

  showEditCustomEquivalentFoodModal: boolean;
  // eslint-disable-next-line no-unused-vars
  setSelectedFood: (food: PersonalEquivalentFood) => void;
  getFoodGroups: () => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  updateSelectedFood: (food: Partial<PersonalEquivalentFood>) => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectFood: (food: PersonalEquivalentFood) => void;
  // eslint-disable-next-line no-unused-vars
  setShowEditCustomEquivalentFoodModal: (show: boolean) => void;
}

export const useEditCustomEquivalentFoodModalStore = create<EditCustomEquivalentFoodModalStore>((set) => ({
  selectedFood: null,
  showEditCustomEquivalentFoodModal: false,
  foodGroups: [],

  setSelectedFood: (food: PersonalEquivalentFood) => set(() => ({ selectedFood: food })),

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

  handleSelectFood: (food: PersonalEquivalentFood) => {
    const selectedFood = {...food};

    set(() => {
      return { selectedFood, showEditCustomEquivalentFoodModal: true };
    });
  },

  setShowEditCustomEquivalentFoodModal: (show: boolean) => set(() => ({ showEditCustomEquivalentFoodModal: show })),
}));
