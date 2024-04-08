import { parseFloatNumber } from "/src/helpers/MathHelpers";
import { RecipeHistoryRecipe } from "/src/types/ReceitaCulinaria";

export const buildRecipeGrams = (recipe: RecipeHistoryRecipe | null) => {

  if (!recipe) return 0;

  const recipeGrams = recipe.alimentos.reduce((acc, food) => {
    const { gramas } = food;
    return acc + gramas;
  }, 0);

  return parseFloatNumber(recipeGrams);
};

export const buildRecipeCarbohydrate = (recipe: RecipeHistoryRecipe | null) => {

  if (!recipe) return 0;

  const recipeCarbohydrate = recipe.alimentos.reduce((acc, food) => {
    const { carboidratos } = food;
    return acc + (carboidratos ?? 0);
  }, 0);

  return parseFloatNumber(recipeCarbohydrate);
}

export const buildRecipeProtein = (recipe: RecipeHistoryRecipe | null) => {

  if (!recipe) return 0;

  const recipeProtein = recipe.alimentos.reduce((acc, food) => {
    const { proteinas } = food;
    return acc + (proteinas ?? 0);
  }, 0);

  return parseFloatNumber(recipeProtein);
}

export const buildReciptLipid = (recipe: RecipeHistoryRecipe | null) => {

  if (!recipe) return 0;

  const recipeLipid = recipe.alimentos.reduce((acc, food) => {
    const { lipideos } = food;
    return acc + (lipideos ?? 0);
  }, 0);

  return parseFloatNumber(recipeLipid);
}

export const buildRecipeCalories = (recipe: RecipeHistoryRecipe | null) => {

  if (!recipe) return 0;

  const recipeCalories = recipe.alimentos.reduce((acc, food) => {
    const { kcal } = food;
    return acc + (kcal ?? 0);
  }, 0);

  return parseFloatNumber(recipeCalories);
}