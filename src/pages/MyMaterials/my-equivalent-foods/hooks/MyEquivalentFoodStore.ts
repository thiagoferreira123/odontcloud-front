import { parseFloatNumber } from "/src/helpers/MathHelpers";
import { listGroups } from "/src/pages/EquivalentEatingPlan/hooks/equivalentPlanListStore/initialState";
import api from "/src/services/useAxios";
import { PersonalEquivalentFood } from "/src/types/Food";
import { create } from "zustand";

interface MyEquivalentFoodStore {

  query: string;
  myEquivalentFoods: PersonalEquivalentFood[];

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;

  getFoods: () => Promise<PersonalEquivalentFood[]>;
  // eslint-disable-next-line no-unused-vars
  setFoods: (foods: PersonalEquivalentFood[]) => void;
  // eslint-disable-next-line no-unused-vars
  addFood: (food: PersonalEquivalentFood) => void;
  // eslint-disable-next-line no-unused-vars
  removeFood: (food: PersonalEquivalentFood) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  updateFood: (food: PersonalEquivalentFood) => void;
}

export const useMyEquivalentFoodStore = create<MyEquivalentFoodStore>((set) => ({

  query: '',

  myEquivalentFoods: [],

  setQuery: (query: string) => set(() => ({ query })),

  getFoods: async () => {
    const { data } = await api.get<PersonalEquivalentFood[]>("/alimento-personalizado-lista-substituto/profissional");

    const myEquivalentFoods = data.map((food) => ({
      ...food,

      alimento:{
        ...food.alimento,
        gramas: parseFloatNumber(food.gramas).toString(),
        carboidrato: parseFloatNumber(food.alimento?.carboidrato).toString(),
        proteina: parseFloatNumber(food.alimento?.proteina).toString(),
        lipideos: parseFloatNumber(food.alimento?.lipideos).toString(),
        energia: parseFloatNumber(food.alimento?.energia).toString(),
      }
    }));

    set({ myEquivalentFoods });
    return myEquivalentFoods;
  },

  setFoods: (foods) => set({ myEquivalentFoods: foods }),

  addFood: (food) => set((state) => ({ myEquivalentFoods: [...state.myEquivalentFoods, food] })),

  removeFood: async (food) =>{
    set((state) => ({
      myEquivalentFoods: state.myEquivalentFoods.filter((f) => f.id !== food.id),
    }))

    const group = listGroups.find((group) => group.name === food.grupo_alimento);

    if(!group) return console.error('Grupo não encontrado');

    const cachedGroupList = JSON.parse(localStorage.getItem('equivalentPlanListStore-' + group.id) ?? '');

    localStorage.setItem('equivalentPlanListStore-' + group.id, JSON.stringify(cachedGroupList.filter((f: PersonalEquivalentFood) => f.id !== food.alimento.id)))

    await api.delete(`/alimento-personalizado-lista-substituto/${food.id}`);
  },

  updateFood: (food) => {
    set((state) => ({
      myEquivalentFoods: state.myEquivalentFoods.map((f) => (f.id === food.id ? food : f)),
    }));
  }
}));