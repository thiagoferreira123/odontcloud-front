import { create } from "zustand";
import { createEquivalentEatingPlanListStore } from "./types";
import { initialState } from "./initialState";
import api from "/src/services/useAxios";

export const useEquivalentEatingPlanListStore = create<createEquivalentEatingPlanListStore>((set) => ({
  ...initialState,

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
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  getSelectedGroups: (selectedFoods, listGroups) => {
    const uniqueGroups = new Map()

    selectedFoods.forEach((food) => {
      const groupName = food.grupo;

      const group = listGroups.find((group) => group.name === groupName)

      if (!uniqueGroups.has(groupName)) {
        uniqueGroups.set(groupName, group)
      }
    })

    const sortedGroups = Array.from(uniqueGroups.values()).sort((a, b) => a.index - b.index)

    return sortedGroups
  }
}));