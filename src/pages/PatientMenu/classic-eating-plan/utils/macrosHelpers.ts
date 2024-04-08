import { parseFloatNumber } from "/src/helpers/MathHelpers";
import { ClassicPlanMeal } from "/src/types/PlanoAlimentarClassico";

export const getPlanCarbohydrates = (meals: ClassicPlanMeal[] | undefined): number => {

  if (!meals) return 0;

  const total = meals.reduce((acc, meal) => {
    if (meal.calculavel == 1) {
      acc += Number(meal.carboidratos ?? 0);
    }
    return acc;
  }, 0);

  const prescrito_g = total;

  return parseFloatNumber(prescrito_g);
}
export const getPlanProteins = (meals: ClassicPlanMeal[] | undefined): number => {

  if (!meals) return 0;

  const total = meals.reduce((acc, meal) => {
    if (meal.calculavel == 1) {
      acc += Number(meal.proteinas ?? 0);
    }
    return acc;
  }, 0);

  const prescrito_g = total;

  return parseFloatNumber(prescrito_g);
}
export const getPlanLipids = (meals: ClassicPlanMeal[] | undefined): number => {

  if (!meals) return 0;

  const total = meals.reduce((acc, meal) => {
    if (meal.calculavel == 1) {
      acc += Number(meal.lipideos ?? 0);
    }
    return acc;
  }, 0);

  const prescrito_g = total;

  return parseFloatNumber(prescrito_g);
}
export const getPlanCalories = (meals: ClassicPlanMeal[] | undefined): number => {

  if (!meals) return 0;

  const total = meals.reduce((acc, meal) => {
    if (meal.calculavel == 1) {
      acc += Number(meal.kcal ?? 0);
    }
    return acc;
  }, 0);

  const prescrito_g = total;

  return parseFloatNumber(prescrito_g);
}

export const getPlanCarbohydratesGrams = (meals: ClassicPlanMeal[] | undefined): number => {
  const carbohydrates = getPlanCarbohydrates(meals);

  return parseFloatNumber(carbohydrates / 4);
}
export const getPlanProteinsGrams = (meals: ClassicPlanMeal[] | undefined): number => {
  const proteins = getPlanProteins(meals);

  return parseFloatNumber(proteins / 4);
}
export const getPlanLipidsGrams = (meals: ClassicPlanMeal[] | undefined): number => {
  const lipids = getPlanLipids(meals);

  return parseFloatNumber(lipids / 9);
}

export const getPlanCarbohydratesGramsByWeight = (meals: ClassicPlanMeal[] | undefined, weight: number) => {

  if (!weight) return 0;

  const carbohydratesGrams = getPlanCarbohydratesGrams(meals);

  return parseFloatNumber(carbohydratesGrams / weight);
}
export const getPlanProteinsGramsByWeight = (meals: ClassicPlanMeal[] | undefined, weight: number) => {

  if (!weight) return 0;

  const proteinsGrams = getPlanProteinsGrams(meals);

  return parseFloatNumber(proteinsGrams / weight);
}
export const getPlanLipidsGramsByWeight = (meals: ClassicPlanMeal[] | undefined, weight: number) => {

  if (!weight) return 0;

  const lipidsGrams = getPlanLipidsGrams(meals);

  return parseFloatNumber(lipidsGrams / weight);
}

export const getPlanCarbohydratesPercentage = (meals: ClassicPlanMeal[] | undefined) => {
  const carbohydrates = getPlanCarbohydrates(meals);
  const calories = getPlanCalories(meals);

  if(!calories || !carbohydrates) return 0

  return parseFloatNumber((carbohydrates / calories) * 100);
}
export const getPlanProteinsPercentage = (meals: ClassicPlanMeal[] | undefined) => {
  const proteins = getPlanProteins(meals);
  const calories = getPlanCalories(meals);

  if(!calories || !proteins) return 0

  return parseFloatNumber((proteins / calories) * 100);
}
export const getPlanLipidsPercentage = (meals: ClassicPlanMeal[] | undefined) => {
  const lipids = getPlanLipids(meals);
  const calories = getPlanCalories(meals);

  if(!calories || !lipids) return 0

  return parseFloatNumber((lipids / calories) * 100);
}