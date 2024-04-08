import { ReplacementListFood } from "/src/types/Food";

const calculateStatistics = (array: number[], totalElements: number) => {
  const result = { mean: 0, variance: 0, deviation: 0 };

  // Calculando a média
  let sum = 0;
  for (let i = 0; i < totalElements; i++) {
    sum += array[i];
  }
  const mean = (result.mean = sum / totalElements);

  // Calculando a variância
  sum = 0;
  for (let i = 0; i < totalElements; i++) {
    sum += Math.pow(array[i] - mean, 2);
  }
  const variance = (result.variance = sum / totalElements);

  // Calculando o desvio padrão
  const deviation = Math.sqrt(variance);

  return deviation;
};

export const averageProtein = (parsedSelectedFoods: ReplacementListFood[]) => {
  const length = parsedSelectedFoods.length ? parsedSelectedFoods.length : 1;

  return Number(parsedSelectedFoods.reduce((acc: number, food: ReplacementListFood) => acc + Number(food.proteina), 0) / length).toFixed(1);
};
export const averageCarbohydrate = (parsedSelectedFoods: ReplacementListFood[]) => {
  const length = parsedSelectedFoods.length ? parsedSelectedFoods.length : 1;

  return Number(parsedSelectedFoods.reduce((acc: number, food: ReplacementListFood) => acc + Number(food.carboidrato), 0) / length).toFixed(1);
};
export const averageFat = (parsedSelectedFoods: ReplacementListFood[]) => {
  const length = parsedSelectedFoods.length ? parsedSelectedFoods.length : 1;

  return Number(parsedSelectedFoods.reduce((acc: number, food: ReplacementListFood) => acc + Number(food.lipideos), 0) / length).toFixed(1);
};
export const averageCalories = (parsedSelectedFoods: ReplacementListFood[]) => {
  const length = parsedSelectedFoods.length ? parsedSelectedFoods.length : 1;

  return Number(parsedSelectedFoods.reduce((acc: number, food: ReplacementListFood) => acc + Number(food.energia), 0) / length).toFixed(1);
};
export const deviationProtein = (parsedSelectedFoods: ReplacementListFood[]) => {
  const length = parsedSelectedFoods.length ? parsedSelectedFoods.length : 1;
  const deviation = calculateStatistics(
    parsedSelectedFoods.map((food: ReplacementListFood) => Number(food.proteina)),
    length
  );

  return !isNaN(deviation) ? deviation.toFixed(1) : 0;
};
export const deviationCarbohydrate = (parsedSelectedFoods: ReplacementListFood[]) => {
  const length = parsedSelectedFoods.length ? parsedSelectedFoods.length : 1;
  const deviation = calculateStatistics(
    parsedSelectedFoods.map((food: ReplacementListFood) => Number(food.carboidrato)),
    length
  );

  return !isNaN(deviation) ? deviation.toFixed(1) : 0;
};
export const deviationFat = (parsedSelectedFoods: ReplacementListFood[]) => {
  const length = parsedSelectedFoods.length ? parsedSelectedFoods.length : 1;
  const deviation = calculateStatistics(
    parsedSelectedFoods.map((food: ReplacementListFood) => Number(food.lipideos)),
    length
  );

  return !isNaN(deviation) ? deviation.toFixed(1) : 0;
};
export const deviationCalories = (parsedSelectedFoods: ReplacementListFood[]) => {
  const length = parsedSelectedFoods.length ? parsedSelectedFoods.length : 1;
  const deviation = calculateStatistics(
    parsedSelectedFoods.map((food: ReplacementListFood) => Number(food.energia)),
    length
  );

  return !isNaN(deviation) ? deviation.toFixed(1) : 0;
};