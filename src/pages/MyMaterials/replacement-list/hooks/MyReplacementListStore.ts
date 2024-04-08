import { listGroups } from "/src/pages/EquivalentEatingPlan/hooks/equivalentPlanListStore/initialState";
import { FoodListGroup } from "/src/pages/EquivalentEatingPlan/hooks/equivalentPlanListStore/types";
import api from "/src/services/useAxios";
import { ReplacementListFood } from "/src/types/Food";
import { EquivalentEatingPlanCustomList } from "/src/types/PlanoAlimentarEquivalente";
import { create } from "zustand";

interface MyReplacementListStore {
  lists: EquivalentEatingPlanCustomList[];

  query: string;

  selectedList: EquivalentEatingPlanCustomList | null;
  selectedGroup: FoodListGroup | null;

  showModal: boolean;
  showDeleteConfirmationModal: boolean;

  // eslint-disable-next-line no-unused-vars
  getGroupFoods: (groupId: number) => Promise<ReplacementListFood[]>;
  getEquivalentEatingPlanCustomList: () => Promise<EquivalentEatingPlanCustomList[]>;
  // eslint-disable-next-line no-unused-vars
  setEquivalentEatingPlanCustomList: (list: EquivalentEatingPlanCustomList[]) => void;
  // eslint-disable-next-line no-unused-vars
  removeList: (list: EquivalentEatingPlanCustomList) => void;
  // eslint-disable-next-line no-unused-vars
  addList: (list: EquivalentEatingPlanCustomList) => void;
  // eslint-disable-next-line no-unused-vars
  updateList: (list: EquivalentEatingPlanCustomList) => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectList: (list: EquivalentEatingPlanCustomList) => void;
  // eslint-disable-next-line no-unused-vars
  updateSelectedList: (list: EquivalentEatingPlanCustomList) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedGroup: (group: FoodListGroup | null) => void;
  // eslint-disable-next-line no-unused-vars
  setShowModal: (show: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  handleShowDeleteConfirmationModal: (show: EquivalentEatingPlanCustomList) => void;
  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
}

export const useMyReplacementListStore = create<MyReplacementListStore>(set => ({
  lists: [],

  query: '',

  selectedList: null,
  selectedGroup: null,
  showModal: false,
  showDeleteConfirmationModal: false,

  getGroupFoods: async (groupId) => {

    const foodsFromStorage = localStorage.getItem(`equivalentPlanListStore-${groupId}`)

    if(foodsFromStorage) {
      const foods = JSON.parse(foodsFromStorage);

      return foods;
    }

    const response = await api.get(`/plano-alimentar-equivalente-grupo${groupId.toString().padStart(2, '0')}`);

    localStorage.setItem(`equivalentPlanListStore-${groupId}`, JSON.stringify(response.data))

    return response.data;
  },

  getEquivalentEatingPlanCustomList: async () => {
    const { data } = await api.get('/plano-alimentar-equivalente-lista-personalizada/profissional/');

    set({ lists: data });

    return data;
  },

  setEquivalentEatingPlanCustomList: (list) => {
    set({ lists: list });
  },

  handleSelectList: (list) => {
    set({ selectedList: list, selectedGroup: listGroups[0], showModal: true });
  },

  removeList: (list) => {
    set((state) => {
      const lists = state.lists.filter((item) => item.id !== list.id);

      return { lists };
    });

    api.delete(`/plano-alimentar-equivalente-lista-personalizada/remove/${list.id}`);
  },

  addList: (list) => {
    set((state) => {
      const lists = [...state.lists, list];

      return { lists };
    });
  },

  updateList: (list) => {
    set((state) => {
      const lists = state.lists.map((item) => {
        if (item.id === list.id) {
          return list;
        }

        return item;
      });

      return { lists };
    });
  },

  updateSelectedList: (list) => {
    set((state) => {return { selectedList: {...state.selectedList, ...list} }});
  },

  setSelectedGroup: (group) => {
    set({ selectedGroup: group });
  },

  setShowModal: (show) => {
    set({ showModal: show });
  },

  handleShowDeleteConfirmationModal: (list) => {
    set({ showDeleteConfirmationModal: true, selectedList: list });
  },

  setQuery: (query) => {
    set({ query });
  },
}));