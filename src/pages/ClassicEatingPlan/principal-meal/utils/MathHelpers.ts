import { parseFloatNumber } from "/src/helpers/MathHelpers"
import useFoods from "/src/hooks/useFoods";
import { ClassicPlanMeal, ClassicPlanMealFood } from "/src/types/PlanoAlimentarClassico"
import { Food } from "/src/types/foods"

export const useMacroNutrientsMath = () => {

  const dataFoods = useFoods((state) => state.foods);

  const carbohydrate = (foods: ClassicPlanMealFood[]): number => {
    return foods.reduce((acc: number, food: ClassicPlanMealFood) => {

      if(food.carbohydrate) return acc + Number(food.carbohydrate)

      const foodData = dataFoods?.find((dataFood: Food) => dataFood.id === food.id_alimento && dataFood.tabela === food.tabela)

      if(!foodData) return acc;

      return acc + Number(foodData.carboidrato * (food.gramas / 100))
    }, 0)
  }
  const protein = (foods: ClassicPlanMealFood[]): number => {
    return foods.reduce((acc: number, food: ClassicPlanMealFood) => {
      if(food.protein) return acc + Number(food.protein)

      const foodData = dataFoods?.find((dataFood: Food) => dataFood.id === food.id_alimento && dataFood.tabela === food.tabela)

      if(!foodData) return acc;

      return acc + Number(foodData.proteina * (food.gramas / 100))
    }, 0)
  }
  const fat = (foods: ClassicPlanMealFood[]): number => {
    return foods.reduce((acc: number, food: ClassicPlanMealFood) => {
      if(food.protein) return acc + Number(food.lipid)

      const foodData = dataFoods?.find((dataFood: Food) => dataFood.id === food.id_alimento && dataFood.tabela === food.tabela)

      if(!foodData) return acc;

      return acc + Number(foodData.lipideos * (food.gramas / 100))
    }, 0)
  }
  const calories = (foods: ClassicPlanMealFood[]) => {
    const totalFat = fat(foods);
    const totalProtein = protein(foods);
    const totalCarbohydrate = carbohydrate(foods);

    return parseFloatNumber((totalFat * 9) + (totalProtein * 4) + (totalCarbohydrate * 4))
  }

  const totalCarbohydrate = (meals: ClassicPlanMeal[]): number => {
    return meals.reduce((acc: number, meal: ClassicPlanMeal) => {
      return acc + carbohydrate(meal.alimentos);
    }, 0)
  }
  const totalProteins = (meals: ClassicPlanMeal[]): number => {
    return meals.reduce((acc: number, meal: ClassicPlanMeal) => {
      return acc + protein(meal.alimentos);
    }, 0)
  }
  const totalFat = (meals: ClassicPlanMeal[]): number => {
    return meals.reduce((acc: number, meal: ClassicPlanMeal) => {
      return acc + fat(meal.alimentos);
    }, 0)
  }
  const totalCalories = (meals: ClassicPlanMeal[]): number => {
    return meals.reduce((acc: number, meal: ClassicPlanMeal) => {
      return acc + calories(meal.alimentos);
    }, 0)
  }

  const carbohydratePercentage = (foods: ClassicPlanMealFood[], meals: ClassicPlanMeal[]) => {
    const carbs = carbohydrate(foods);

    return parseFloatNumber((carbs / totalCarbohydrate(meals)) * 100)
  }
  const proteinPercentage = (foods: ClassicPlanMealFood[], meals: ClassicPlanMeal[]) => {
    const prots = protein(foods);

    return parseFloatNumber((prots / totalProteins(meals)) * 100)
  }
  const fatPercentage = (foods: ClassicPlanMealFood[], meals: ClassicPlanMeal[]) => {
    const lips = fat(foods);

    return parseFloatNumber((lips / totalFat(meals)) * 100)
  }
  const caloriesPercentage = (foods: ClassicPlanMealFood[], meals: ClassicPlanMeal[]) => {
    const kcal = calories(foods);

    return parseFloatNumber((kcal / totalCalories(meals)) * 100)
  }

  return {
    carbohydrate,
    protein,
    fat,
    calories,
    totalCarbohydrate,
    totalProteins,
    totalFat,
    totalCalories,
    carbohydratePercentage,
    proteinPercentage,
    fatPercentage,
    caloriesPercentage
  }
}