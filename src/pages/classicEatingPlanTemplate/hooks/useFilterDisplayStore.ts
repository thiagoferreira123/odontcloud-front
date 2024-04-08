import { create } from "zustand";


interface FoodTablesStore {
  selectedTables: string[];
  showNutrients: boolean

  // eslint-disable-next-line no-unused-vars
  setSelectedTables: (selectedTables: string[]) => void;
  // eslint-disable-next-line no-unused-vars
  setShowNutrients: (showNutrients: boolean) => void;
}

const useFilterDisplayStore = create<FoodTablesStore>((set) => ({
  selectedTables: ['taco', 'ibge', 'tucunduva', 'usda', 'suplementos', 'alimento_customizado'],
  showNutrients: true,

  setSelectedTables: (selectedTables) => set({ selectedTables }),
  setShowNutrients: (showNutrients) => {set({ showNutrients })},
}));

export default useFilterDisplayStore;