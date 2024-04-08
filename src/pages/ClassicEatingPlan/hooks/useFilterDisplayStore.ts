import { create } from "zustand";

export const foodTables = ['taco', 'ibge', 'tucunduva', 'usda', 'suplementos', 'alimento_customizado', 'receita']

interface FoodTablesStore {
  selectedTables: string[];
  showNutrients: boolean

  // eslint-disable-next-line no-unused-vars
  setSelectedTables: (selectedTables: string[]) => void;
  // eslint-disable-next-line no-unused-vars
  setShowNutrients: (showNutrients: boolean) => void;
}

const useFilterDisplayStore = create<FoodTablesStore>((set) => ({
  selectedTables: foodTables,
  showNutrients: true,

  setSelectedTables: (selectedTables) => set({ selectedTables }),
  setShowNutrients: (showNutrients) => {set({ showNutrients })},
}));

export default useFilterDisplayStore;