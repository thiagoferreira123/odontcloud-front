import { parseFloatNumber } from "../../../../helpers/MathHelpers"
import { EquivalentEatingPlanMeal, EquivalentEatingPlanMealFood } from "../../../../types/PlanoAlimentarEquivalente"

export const carbohydrate = (foods: EquivalentEatingPlanMealFood[]): number => {
  return foods.reduce((acc: number, food: EquivalentEatingPlanMealFood) => {
    return acc + Number(food.carboidratos * food.quantidade)
  }, 0)
}
export const protein = (foods: EquivalentEatingPlanMealFood[]): number => {
  return foods.reduce((acc: number, food: EquivalentEatingPlanMealFood) => {
    return acc + Number(food.proteinas * food.quantidade)
  }, 0)
}
export const fat = (foods: EquivalentEatingPlanMealFood[]): number => {
  return foods.reduce((acc: number, food: EquivalentEatingPlanMealFood) => {
    return acc + Number(food.lipideos * food.quantidade)
  }, 0)
}
export const calories = (foods: EquivalentEatingPlanMealFood[]) => {
  return foods.reduce((acc: number, food: EquivalentEatingPlanMealFood) => {
    return acc + Number(food.kcal)
  }, 0)
}

export const totalCarbohydrate = (meals: EquivalentEatingPlanMeal[]): number => {
  return meals.reduce((acc: number, meal: EquivalentEatingPlanMeal) => {
    return acc + carbohydrate(meal.alimentos);
  }, 0)
}
export const totalProteins = (meals: EquivalentEatingPlanMeal[]): number => {
  return meals.reduce((acc: number, meal: EquivalentEatingPlanMeal) => {
    return acc + protein(meal.alimentos);
  }, 0)
}
export const totalFat = (meals: EquivalentEatingPlanMeal[]): number => {
  return meals.reduce((acc: number, meal: EquivalentEatingPlanMeal) => {
    return acc + fat(meal.alimentos);
  }, 0)
}
export const totalCalories = (meals: EquivalentEatingPlanMeal[]): number => {
  return meals.reduce((acc: number, meal: EquivalentEatingPlanMeal) => {
    return acc + calories(meal.alimentos);
  }, 0)
}

export const carbohydratePercentage = (foods: EquivalentEatingPlanMealFood[], meals: EquivalentEatingPlanMeal[]) => {
  const carbs = carbohydrate(foods);

  if(!totalCarbohydrate(meals)) return 0;

  return parseFloatNumber((carbs / totalCarbohydrate(meals)) * 100)
}
export const proteinPercentage = (foods: EquivalentEatingPlanMealFood[], meals: EquivalentEatingPlanMeal[]) => {
  const prots = protein(foods);

  if(!totalProteins(meals)) return 0;

  return parseFloatNumber((prots / totalProteins(meals)) * 100)
}
export const fatPercentage = (foods: EquivalentEatingPlanMealFood[], meals: EquivalentEatingPlanMeal[]) => {
  const lips = fat(foods);

  if(!totalFat(meals)) return 0;

  return parseFloatNumber((lips / totalFat(meals)) * 100)
}
export const caloriesPercentage = (foods: EquivalentEatingPlanMealFood[], meals: EquivalentEatingPlanMeal[]) => {
  const kcal = calories(foods);

  if(!totalCalories(meals)) return 0;

  return parseFloatNumber((kcal / totalCalories(meals)) * 100)
}