import { FoodListGroup } from "/src/pages/EquivalentEatingPlan/hooks/equivalentPlanListStore/types";
import { EquivalentEatingPlanGrupoSelectedFood, EquivalentEatingPlanMeal } from "/src/types/PlanoAlimentarEquivalente";

export const calculateGroupData = async (selectedFoods: EquivalentEatingPlanGrupoSelectedFood[], group: FoodListGroup, meals: EquivalentEatingPlanMeal[]) => {

  const total = selectedFoods.filter((food) => food.grupo === group.name).length;

  const percentage = (total / selectedFoods.length) * 100;

  const grams = meals.map((meal) => {
    const mealFoods = meal.alimentos.filter(food => food.grupo == group.name).map((alimento) => Number(alimento.gramas) * Number(alimento.quantidade));

    const totalGrams = mealFoods.reduce((acc, curr) => acc + curr, 0);

    return totalGrams;
  }).reduce((acc, curr) => acc + curr, 0);

  return {
    id: group.id,
    title: group.title.split('<small>')[0].replace('<br>', ''),
    name: group.name,
    total,
    percentage,
    grams,
    color: group.color,
  }
}