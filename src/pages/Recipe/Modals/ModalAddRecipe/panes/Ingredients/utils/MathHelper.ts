import { parseFloatNumber } from "/src/helpers/MathHelpers";
import { RecipeHistoryRecipeFood } from "/src/types/ReceitaCulinaria";

export const buildRecipeGrams = (foods: RecipeHistoryRecipeFood[]) => {
  const recipeGrams = foods.reduce((acc, food) => {
    const { gramas } = food;
    return acc + gramas;
  }, 0);

  return parseFloatNumber(recipeGrams);
};

export const buildRecipeCarbohydrate = (foods: RecipeHistoryRecipeFood[]) => {
  const recipeCarbohydrate = foods.reduce((acc, food) => {
    const { carboidratos } = food;
    return acc + (carboidratos ?? 0);
  }, 0);

  return parseFloatNumber(recipeCarbohydrate);
}

export const buildRecipeProtein = (foods: RecipeHistoryRecipeFood[]) => {
  const recipeProtein = foods.reduce((acc, food) => {
    const { proteinas } = food;
    return acc + (proteinas ?? 0);
  }, 0);

  return parseFloatNumber(recipeProtein);
}

export const buildReciptLipid = (foods: RecipeHistoryRecipeFood[]) => {
  const recipeLipid = foods.reduce((acc, food) => {
    const { lipideos } = food;
    return acc + (lipideos ?? 0);
  }, 0);

  return parseFloatNumber(recipeLipid);
}

export const buildRecipeCalories = (foods: RecipeHistoryRecipeFood[]) => {
  const recipeCalories = foods.reduce((acc, food) => {
    const { kcal } = food;
    return acc + (kcal ?? 0);
  }, 0);

  return parseFloatNumber(recipeCalories);
}

export const buildFiber = (foods: RecipeHistoryRecipeFood[]) => {
  const recipeFiber = foods.reduce((acc, food) => {
    const { fibraAlimentar } = food.food ?? { fibraAlimentar: 0 };
    return acc + Number(fibraAlimentar ? fibraAlimentar : 0);
  }, 0);

  return parseFloatNumber(recipeFiber);
}

export const buildCalcium = (foods: RecipeHistoryRecipeFood[]) => {
  const recipeCalciun = foods.reduce((acc, food) => {
    const { calcio } = food.food ?? { calcio: 0 };
    return acc + Number(calcio ? calcio : 0);
  }, 0);

  return parseFloatNumber(recipeCalciun);
}

export const buildSodium = (foods: RecipeHistoryRecipeFood[]) => {
  const recipeSodium = foods.reduce((acc, food) => {
    const { sodio } = food.food ?? { sodio: 0 };
    return acc + Number(sodio ? sodio : 0);
  }, 0);

  return parseFloatNumber(recipeSodium);
}

export const buildSaturatedFattyAcids =  (foods: RecipeHistoryRecipeFood[]) => {
  const recipeSaturatedFattyAcids = foods.reduce((acc, food) => {
    const { acidosGraxosSaturados } = food.food ?? { acidosGraxosSaturados: 0 };
    return acc + Number(acidosGraxosSaturados ? acidosGraxosSaturados : 0);
  }, 0);

  return parseFloatNumber(recipeSaturatedFattyAcids);
}

export const buildCholesterol = (foods: RecipeHistoryRecipeFood[]) => {
  const recipeCholesterol = foods.reduce((acc, food) => {
    const { colesterol } = food.food ?? { colesterol: 0 };
    return acc + Number(colesterol ? colesterol : 0);
  }, 0);

  return parseFloatNumber(recipeCholesterol);
}

/**
 * ByWeigth
 */
export const calculatePortionNutrientByWeigth = (totalWeigth: string | number, nutrient: number, targetWeigth: string | number) => {
  totalWeigth = totalWeigth ? Number(totalWeigth) : 0;
  targetWeigth = targetWeigth ? Number(targetWeigth) : 0;
  return totalWeigth ? parseFloatNumber((targetWeigth / totalWeigth) * nutrient) : 0;
};

/**
 *  Nutrients By Weigth
 */

export const calculatePortionCarbohydrateByWeigth = (totalWeigth: string | number, foods: RecipeHistoryRecipeFood[], targetWeigth: string | number) => {
  const carbohydrate = buildRecipeCarbohydrate(foods);
  return calculatePortionNutrientByWeigth(totalWeigth, carbohydrate, targetWeigth);
};

export const calculatePortionProteinByWeigth = (totalWeigth: string | number, foods: RecipeHistoryRecipeFood[], targetWeigth: string | number) => {
  const protein = buildRecipeProtein(foods);
  return calculatePortionNutrientByWeigth(totalWeigth, protein, targetWeigth);
}

export const calculatePortionLipidByWeigth = (totalWeigth: string | number, foods: RecipeHistoryRecipeFood[], targetWeigth: string | number) => {
  const lipid = buildReciptLipid(foods);
  return calculatePortionNutrientByWeigth(totalWeigth, lipid, targetWeigth);
}

export const calculatePortionCaloriesByWeigth = (totalWeigth: string | number, foods: RecipeHistoryRecipeFood[], targetWeigth: string | number) => {
  const calories = buildRecipeCalories(foods);
  return calculatePortionNutrientByWeigth(totalWeigth, calories, targetWeigth);
}

export const calculatePortionFiberByWeigth = (totalWeigth: string | number, foods: RecipeHistoryRecipeFood[], targetWeigth: string | number) => {
  const fiber = buildFiber(foods);
  return calculatePortionNutrientByWeigth(totalWeigth, fiber, targetWeigth);
}

export const calculatePortionCalciumByWeigth = (totalWeigth: string | number, foods: RecipeHistoryRecipeFood[], targetWeigth: string | number) => {
  const calcium = buildCalcium(foods);
  return calculatePortionNutrientByWeigth(totalWeigth, calcium, targetWeigth);
}

export const calculatePortionSodiumByWeigth = (totalWeigth: string | number, foods: RecipeHistoryRecipeFood[], targetWeigth: string | number) => {
  const sodium = buildSodium(foods);
  return calculatePortionNutrientByWeigth(totalWeigth, sodium, targetWeigth);
}

export const calculatePortionSaturatedFattyAcidsByWeigth = (totalWeigth: string | number, foods: RecipeHistoryRecipeFood[], targetWeigth: string | number) => {
  const saturatedFattyAcids = buildSaturatedFattyAcids(foods);
  return calculatePortionNutrientByWeigth(totalWeigth, saturatedFattyAcids, targetWeigth);
}

export const calculatePortionCholesterolByWeigth = (totalWeigth: string | number, foods: RecipeHistoryRecipeFood[], targetWeigth: string | number) => {
  const cholesterol = buildCholesterol(foods);
  return calculatePortionNutrientByWeigth(totalWeigth, cholesterol, targetWeigth);
}
