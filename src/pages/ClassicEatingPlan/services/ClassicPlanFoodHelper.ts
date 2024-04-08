import { escapeRegexCharacters } from "../../../helpers/SearchFoodHelper";
import { Food } from "../../../types/foods";

export const getSuggestions = (foods: Food[], value: string, selectedTables: string[]) => {
  const escapedValue = escapeRegexCharacters(value.trim());
  if (escapedValue === '' || !foods || escapedValue.length < 3) {
    return [];
  }

  const items = foods.filter((food) =>
    food.descricaoDoAlimento &&
    escapeRegexCharacters(food.descricaoDoAlimento.trim()).includes(escapedValue) &&
    selectedTables.includes(food.tabela.toLowerCase())
  );

  return items
};