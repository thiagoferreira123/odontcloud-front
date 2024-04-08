import { create } from "zustand";
import { Food } from "../../../../types/foods";
import api from "../../../../services/useAxios";
import { parseFloatNumber } from "../../../../helpers/MathHelpers";

interface MyFoodStore {

  query: string;
  myFoods: Food[];

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;

  getFoods: () => Promise<Food[]>;
  // eslint-disable-next-line no-unused-vars
  setFoods: (foods: Food[]) => void;
  // eslint-disable-next-line no-unused-vars
  addFood: (food: Food) => void;
  // eslint-disable-next-line no-unused-vars
  removeFood: (food: Food) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  updateFood: (food: Food) => void;
}

export const useMyFoodStore = create<MyFoodStore>((set) => ({

  query: '',

  myFoods: [],

  setQuery: (query: string) => set(() => ({ query })),

  getFoods: async () => {
    const { data } = await api.get<Food[]>("/alimento-personalizado");

    const myFoods = data.map((food) => ({
      ...food,
      gramas1: parseFloatNumber(food.gramas1).toString(),
      carboidrato: parseFloatNumber(food.carboidrato),
      proteina: parseFloatNumber(food.proteina),
      lipideos: parseFloatNumber(food.lipideos),
      energia: parseFloatNumber(food.energia),

      medidaCaseira2: food.medidaCaseira2 === 'SEM_MEDIDA' ? '' : food.medidaCaseira2,
      gramas2: food.medidaCaseira2 === 'SEM_MEDIDA' ? '' : parseFloatNumber(food.gramas2).toString(),
      medidaCaseira3: food.medidaCaseira3 === 'SEM_MEDIDA' ? '' : food.medidaCaseira3,
      gramas3: food.medidaCaseira3 === 'SEM_MEDIDA' ? '' : parseFloatNumber(food.gramas3).toString(),
    }));

    set({ myFoods });
    return myFoods;
  },

  setFoods: (foods) => set({ myFoods: foods }),

  addFood: (food) => set((state) => ({ myFoods: [...state.myFoods, food] })),

  removeFood: async (food) =>{
    set((state) => ({
      myFoods: state.myFoods.filter((f) => f.id !== food.id),
    }))

    await api.delete(`/alimento-personalizado/${food.id}`);
  },

  updateFood: (food) => {
    set((state) => ({
      myFoods: state.myFoods.map((f) => (f.id === food.id ? food : f)),
    }));
  }
}));