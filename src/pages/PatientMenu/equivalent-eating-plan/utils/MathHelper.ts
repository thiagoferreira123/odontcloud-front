import { parseFloatNumber } from "/src/helpers/MathHelpers";
import { calories, carbohydrate, fat, protein } from "/src/pages/EquivalentEatingPlan/meal/utils/MathHelpers";
import { EquivalentEatingPlanMeal } from "/src/types/PlanoAlimentarEquivalente";

export const getPlanCarbohydrates = (meals: EquivalentEatingPlanMeal[]) => {
  if (!meals) return 0;

  return parseFloatNumber(meals.reduce((acc, meal) => {
    acc += carbohydrate(meal.alimentos);
    return acc;
  }, 0) * 4);
}
export const getPlanProteins = (meals: EquivalentEatingPlanMeal[]) => {
  if (!meals) return 0;


  return parseFloatNumber(meals.reduce((acc, meal) => {
    acc += protein(meal.alimentos);
    return acc;
  }, 0) * 4);
}
export const getPlanLipids = (meals: EquivalentEatingPlanMeal[]) => {
  if (!meals) return 0;

  return parseFloatNumber(meals.reduce((acc, meal) => {
    acc += fat(meal.alimentos);
    return acc;
  }, 0) * 9);
}
export const getPlanCalories = (meals: EquivalentEatingPlanMeal[]) => {
  if (!meals) return 0;

  return parseFloatNumber(meals.reduce((acc, meal) => {
    acc += calories(meal.alimentos);
    return acc;
  }, 0));
}

export const getPlanCarbohydratesGrams = (meals: EquivalentEatingPlanMeal[]) => {
  const carbohydrates = getPlanCarbohydrates(meals);

  return parseFloatNumber(carbohydrates / 4);
}
export const getPlanProteinsGrams = (meals: EquivalentEatingPlanMeal[]) => {
  const proteins = getPlanProteins(meals);

  return parseFloatNumber(proteins / 4);
}
export const getPlanLipidsGrams = (meals: EquivalentEatingPlanMeal[]) => {
  const lipids = getPlanLipids(meals);

  return parseFloatNumber(lipids / 9);
}

export const getPlanCarbohydratesGramsByWeight = (meals: EquivalentEatingPlanMeal[], weight: number) => {

  if (!weight) return 0;

  const carbohydratesGrams = getPlanCarbohydratesGrams(meals);

  return parseFloatNumber(carbohydratesGrams / weight);
}
export const getPlanProteinsGramsByWeight = (meals: EquivalentEatingPlanMeal[], weight: number) => {

  if (!weight) return 0;

  const proteinsGrams = getPlanProteinsGrams(meals);

  return parseFloatNumber(proteinsGrams / weight);
}
export const getPlanLipidsGramsByWeight = (meals: EquivalentEatingPlanMeal[], weight: number) => {

  if (!weight) return 0;

  const lipidsGrams = getPlanLipidsGrams(meals);

  return parseFloatNumber(lipidsGrams / weight);
}

export const getPlanCarbohydratesPercentage = (meals: EquivalentEatingPlanMeal[]) => {
  const carbohydrates = getPlanCarbohydrates(meals);
  const calories = getPlanCalories(meals);

  if(!calories || !carbohydrates) return 0

  return parseFloatNumber((carbohydrates / calories) * 100);
}
export const getPlanProteinsPercentage = (meals: EquivalentEatingPlanMeal[]) => {
  const proteins = getPlanProteins(meals);
  const calories = getPlanCalories(meals);

  if(!calories || !proteins) return 0

  return parseFloatNumber((proteins / calories) * 100);
}
export const getPlanLipidsPercentage = (meals: EquivalentEatingPlanMeal[]) => {
  const lipids = getPlanLipids(meals);
  const calories = getPlanCalories(meals);

  if(!calories || !lipids) return 0

  return parseFloatNumber((lipids / calories) * 100);
}