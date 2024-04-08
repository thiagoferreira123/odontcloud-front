import { escapeRegexCharacters } from "/src/helpers/SearchFoodHelper";
import { Food } from "/src/types/foods";

export const getSuggestions = (foods: Food[], value: string) => {
  const escapedValue = escapeRegexCharacters(value.trim());
  if (escapedValue === '' || !foods || escapedValue.length < 3) {
    return [];
  }

  const items = foods.filter((food) =>
    food.descricaoDoAlimento &&
    escapeRegexCharacters(food.descricaoDoAlimento.trim()).includes(escapedValue)
  );

  return items
};