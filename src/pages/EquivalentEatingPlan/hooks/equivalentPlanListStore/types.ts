import { ReplacementListFood } from "/src/types/Food";
import { EquivalentEatingPlanGrupoSelectedFood } from "/src/types/PlanoAlimentarEquivalente";

export interface createEquivalentEatingPlanListStore {
  listGroups: FoodListGroup[];

  selectedGroup: FoodListGroup | null;

  // eslint-disable-next-line no-unused-vars
  getGroupFoods: (groupId: number) => Promise<ReplacementListFood[]>;
  // eslint-disable-next-line no-unused-vars
  setSelectedGroup: (group: FoodListGroup | null) => void;
  // eslint-disable-next-line no-unused-vars
  getSelectedGroups: (selectedFoods: EquivalentEatingPlanGrupoSelectedFood[], listGroups: FoodListGroup[]) => FoodListGroup[];
}

export interface FoodListGroup {
  id: number;
  name: string;
  title: string;
  nutrient?: string;
  color: string;
}