import { EquivalentEatingPlanGrupoSelectedFood } from "/src/types/PlanoAlimentarEquivalente";
import { FoodListGroup } from "../types";

export const getSelectedGroups = (selectedFoods: EquivalentEatingPlanGrupoSelectedFood[], listGroups: FoodListGroup[]) => {
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