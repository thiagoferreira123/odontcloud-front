import React from 'react';
import { Table } from 'react-bootstrap';
import useClassicPlan from '../hooks/useClassicPlan';
import { parseFloatNumber } from '/src/helpers/MathHelpers';
import useMacrosStore from '../hooks/useMacrosStore';
import { useMacroNutrientsMath } from '../principal-meal/utils/MathHelpers';

export default function MacronutrientsByMeal() {

  const meals = useClassicPlan((state) => state.meals);

  const vrPeso = useMacrosStore((state) => state.vrPeso);

  const { carbohydrate, protein, fat, calories, caloriesPercentage, carbohydratePercentage, fatPercentage, proteinPercentage, totalCalories, totalCarbohydrate, totalFat, totalProteins } = useMacroNutrientsMath();

  return (
    <>
      <Table striped>
        <thead>
          <tr>
            <th scope="col">Refeições | Horários</th>
            <th scope="col">Carboidratos (g)</th>
            <th scope="col">Proteínas (g)</th>
            <th scope="col">Lípideos (g)</th>
            <th scope="col">Calorias (kcal)</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr key={meal.id}>
              <td>
                {meal.nome} - {meal.horario.slice(0, 5)}
              </td>
              <td>
                {parseFloatNumber(carbohydrate(meal.alimentos))} ({carbohydratePercentage(meal.alimentos, meals)}%)
              </td>
              <td>
                {parseFloatNumber((protein(meal.alimentos)))} ({proteinPercentage(meal.alimentos, meals)}%)
              </td>
              <td>
                {parseFloatNumber((fat(meal.alimentos)))} ({fatPercentage(meal.alimentos, meals)}%)
              </td>
              <td>
                {parseFloatNumber((calories(meal.alimentos)))} ({caloriesPercentage(meal.alimentos, meals)}%)
              </td>
            </tr>
          ))}

          <tr>
            <th className="fw-bolder">Somatória de macronutrientes</th>
            <th className="fw-bolder">{parseFloatNumber(totalCarbohydrate(meals))}</th>
            <th className="fw-bolder">{parseFloatNumber(totalProteins(meals))}</th>
            <th className="fw-bolder">{parseFloatNumber(totalFat(meals))}</th>
            <th className="fw-bolder">{parseFloatNumber(totalCalories(meals))}</th>
          </tr>

          <tr>
            <th className="fw-bolder">Total por kilo de peso corporal</th>
            <th className="fw-bolder">{Number(vrPeso) ? parseFloatNumber(totalCarbohydrate(meals) / Number(vrPeso)) + 'g/kg' : 0}</th>
            <th className="fw-bolder">{Number(vrPeso) ? parseFloatNumber(totalProteins(meals) / Number(vrPeso)) + 'g/kg' : 0}</th>
            <th className="fw-bolder">{Number(vrPeso) ? parseFloatNumber(totalFat(meals) / Number(vrPeso)) + 'g/kg' : 0}</th>
            <th className="fw-bolder">{Number(vrPeso) ? parseFloatNumber(totalCalories(meals) / Number(vrPeso)) + 'g/kg' : 0}</th>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
